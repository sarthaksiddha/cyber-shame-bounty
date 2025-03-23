
import { useState, useEffect } from 'react';
import { CrimeData } from '@/types/mapTypes';
import { 
  createMarker, 
  createPolygon, 
  isPolygonSupported,
  detectApiVersion
} from '@/utils/mapApiUtils';
import { generateCirclePoints } from '@/utils/mapUtils';
import { toast } from '@/components/ui/use-toast';

export function useMapMarkers(
  mapInstanceRef: React.MutableRefObject<any>,
  mapInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  selectedState: CrimeData | null,
  setSelectedState: (state: CrimeData) => void,
  mapView: 'heatmap' | 'bubble'
) {
  const [markersCreated, setMarkersCreated] = useState(0);
  const [markersRef, setMarkersRef] = useState<any[]>([]);
  const [polygonsRef, setPolygonsRef] = useState<any[]>([]);
  const [apiVersion, setApiVersion] = useState<'legacy' | 'modern' | 'leaflet' | 'mappls' | 'maplibre' | null>(null);

  // Function to clean up existing markers and polygons
  const cleanupMapObjects = () => {
    // Clean up markers
    if (markersRef.length > 0) {
      markersRef.forEach(marker => {
        try {
          if (marker.remove) {
            marker.remove();
          } else if (mapInstanceRef.current && marker.setMap) {
            marker.setMap(null);
          }
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      setMarkersRef([]);
    }

    // Clean up polygons
    if (polygonsRef.length > 0) {
      polygonsRef.forEach(polygon => {
        try {
          if (polygon.remove) {
            polygon.remove();
          } else if (mapInstanceRef.current && polygon.setMap) {
            polygon.setMap(null);
          }
        } catch (e) {
          console.warn('Error removing polygon:', e);
        }
      });
      setPolygonsRef([]);
    }
  };

  // Function to create marker for a state
  const createStateMarker = (state: CrimeData) => {
    if (!state.coordinates || !mapInstanceRef.current) return null;
    
    try {
      const resolutionRate = state.resolved / state.incidents;
      const radius = Math.sqrt(state.incidents) / 20;
      const isSelected = selectedState?.state === state.state;
      
      // Create an SVG for the marker based on state data
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${radius * 2}px" height="${radius * 2}px"><circle cx="50" cy="50" r="40" fill="rgba(${Math.floor(255 * (1 - resolutionRate))}, ${Math.floor(255 * resolutionRate)}, 100, 0.7)" stroke="${isSelected ? 'white' : 'none'}" stroke-width="${isSelected ? '4' : '0'}"/></svg>`;
      const svgUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
      
      const detected = detectApiVersion();
      if (detected === 'leaflet') {
        // Special handling for Leaflet API
        if (window.MapmyIndia.L?.marker && mapInstanceRef.current) {
          // Convert [lng, lat] to [lat, lng] for Leaflet
          const position: [number, number] = [state.coordinates[1], state.coordinates[0]];
          
          // Create a custom icon with our SVG
          let icon = null;
          if (window.MapmyIndia.L.icon) {
            icon = window.MapmyIndia.L.icon({
              iconUrl: svgUrl,
              iconSize: [radius * 2, radius * 2],
              iconAnchor: [radius, radius]
            });
          }
          
          const marker = window.MapmyIndia.L.marker(position, { icon });
          marker.addTo(mapInstanceRef.current);
          
          // Add popup for state info
          const popupContent = `<b>${state.state}</b><br>Incidents: ${state.incidents}<br>Resolved: ${state.resolved}`;
          marker.bindPopup(popupContent);
          
          // Add click handler
          marker.on('click', () => {
            setSelectedState(state);
          });
          
          setMarkersRef(prev => [...prev, marker]);
          return marker;
        }
      } else {
        // Standard marker creation for other API versions
        const markerOptions = {
          position: state.coordinates,
          icon: {
            url: svgUrl,
            size: { width: radius * 2, height: radius * 2 },
            anchor: { x: radius, y: radius }
          },
          popupOptions: {
            content: `<b>${state.state}</b><br>Incidents: ${state.incidents}<br>Resolved: ${state.resolved}`
          }
        };

        const marker = createMarker(markerOptions, mapInstanceRef.current);
        
        // Try to add click listener - different methods for different API versions
        if (marker) {
          try {
            // Method 1: Modern API with addListener
            if (typeof marker.addListener === 'function') {
              marker.addListener('click', () => {
                setSelectedState(state);
              });
            } 
            // Method 2: Leaflet API with on
            else if (marker.on) {
              marker.on('click', () => {
                setSelectedState(state);
              });
            }
            // Method 3: Try setting onclick directly
            else if (marker.element) {
              marker.element.onclick = () => {
                setSelectedState(state);
              };
            }
          } catch (e) {
            console.warn('Could not add marker click listener:', e);
          }
          
          setMarkersRef(prev => [...prev, marker]);
          return marker;
        }
      }
      return null;
    } catch (error) {
      console.error('Error creating state marker:', error);
      return null;
    }
  };

  // Update map view when view type or selected state changes
  useEffect(() => {
    if (mapInstanceRef.current && mapInitialized) {
      updateMapView();
    }
    
    // Cleanup on unmount
    return () => {
      cleanupMapObjects();
    };
  }, [mapView, selectedState, mapInitialized]);
  
  // Main function to update the map view based on view mode
  const updateMapView = () => {
    import('@/data/crimeMapData').then(({ stateData }) => {
      if (!mapInstanceRef.current || !mapInitialized) {
        console.warn('Map not initialized yet, cannot update view');
        return;
      }

      try {
        // Clean up existing markers and polygons
        cleanupMapObjects();
        
        // Update API version
        setApiVersion(detectApiVersion());
        
        if (mapView === 'bubble') {
          renderBubbleView(stateData);
        } else {
          if (isPolygonSupported()) {
            renderHeatmapView(stateData);
          } else {
            console.warn('Polygon not supported in this API version. Falling back to bubble view.');
            toast({
              title: "Heatmap view unavailable",
              description: "Falling back to bubble view due to API limitations",
              variant: "default"
            });
            renderBubbleView(stateData);
          }
        }
      } catch (error) {
        console.error('Error updating map view:', error);
        // Fallback to bubble view if there's an error
        if (mapView === 'heatmap') {
          renderBubbleView(stateData);
        }
      }
    });
  };

  // Render bubble view (circles for each state)
  const renderBubbleView = (stateData: CrimeData[]) => {
    let markerCount = 0;
    
    stateData.forEach((state) => {
      if (!state.coordinates) return;
      
      const marker = createStateMarker(state);
      if (marker) markerCount++;
    });
    
    console.log(`Created ${markerCount} markers with API version: ${apiVersion || 'unknown'}`);
    setMarkersCreated(markerCount);
    
    if (markerCount === 0) {
      toast({
        title: "Warning",
        description: "Failed to display map markers. API might be incompatible.",
        variant: "default"
      });
    }
  };

  // Render heatmap view (intensity polygons)
  const renderHeatmapView = (stateData: CrimeData[]) => {
    let polygonsCreated = 0;
    let markersCreated = 0;
    
    stateData.forEach((state) => {
      if (!state.coordinates || !mapInstanceRef.current) return;
      
      const intensity = Math.min(state.incidents / 5000, 1);
      const radius = Math.sqrt(state.incidents) / 10 * 30000;
      
      try {
        const circleCoords = generateCirclePoints(state.coordinates, radius, 20);
        
        const polygonOptions = {
          paths: [circleCoords],
          fillColor: `rgba(255, 0, 0, ${intensity * 0.5})`,
          fillOpacity: 0.5,
          strokeColor: 'rgba(255, 0, 0, 0.1)',
          strokeOpacity: 0.1,
          strokeWeight: 1
        };
        
        const polygon = createPolygon(polygonOptions, mapInstanceRef.current);
        if (polygon) {
          polygonsCreated++;
          setPolygonsRef(prev => [...prev, polygon]);
          
          // Create a marker for selection capability
          const marker = createStateMarker(state);
          if (marker) markersCreated++;
        }
      } catch (polygonError) {
        console.error('Error creating heatmap polygon:', polygonError);
      }
    });
    
    console.log(`Created ${polygonsCreated} polygons and ${markersCreated} markers with API version: ${apiVersion || 'unknown'}`);
    setMarkersCreated(markersCreated);
    
    if (polygonsCreated === 0) {
      renderBubbleView(stateData);
    }
  };

  return {
    markersCreated,
    apiVersion,
    updateMapView,
    cleanupMapObjects
  };
}
