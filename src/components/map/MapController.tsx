
import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Undo } from 'lucide-react';
import { Button } from '../ui/button';
import { CrimeData } from '@/types/mapTypes';
import { generateCirclePoints, formatNumber } from '@/utils/mapUtils';
import { toast } from '../ui/use-toast';

interface MapControllerProps {
  selectedState: CrimeData | null;
  setSelectedState: (state: CrimeData) => void;
  mapView: 'heatmap' | 'bubble';
}

const MapController: React.FC<MapControllerProps> = ({ 
  selectedState, 
  setSelectedState,
  mapView 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiVersion, setApiVersion] = useState<'legacy' | 'modern'>('modern');

  // Initialize map when component mounts or becomes visible
  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current) return;
      
      // Use a timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        if (!mapInitialized && mapRef.current) {
          initializeMap();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    };

    // Load map immediately and also when window is resized
    loadMap();
    
    // Add resize event listener to re-initialize map if window size changes
    window.addEventListener('resize', loadMap);
    
    return () => {
      window.removeEventListener('resize', loadMap);
    };
  }, [mapRef.current]);

  // Observer to detect when map is in viewport
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.unobserve(entry.target);

          setTimeout(() => {
            initializeMap();
          }, 300);
        }
      });
    }, observerOptions);

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, []);

  // Update map view when view type or selected state changes
  useEffect(() => {
    if (mapVisible && mapInstanceRef.current && mapInitialized) {
      updateMapView();
    }
  }, [mapView, selectedState, mapVisible, mapInitialized]);

  const detectApiVersion = () => {
    // Check if we're using modern or legacy API
    if (window.MapmyIndia && window.MapmyIndia.map && typeof window.MapmyIndia.map.Marker === 'function') {
      console.log('Using modern MapmyIndia API');
      setApiVersion('modern');
      return 'modern';
    } else if (window.MapmyIndia && typeof window.MapmyIndia.Marker === 'function') {
      console.log('Using legacy MapmyIndia API');
      setApiVersion('legacy');
      return 'legacy';
    } else {
      console.error('Cannot detect MapmyIndia API version');
      return null;
    }
  };

  const createMarker = (state: CrimeData, version: 'modern' | 'legacy' | null) => {
    if (!state.coordinates) return null;
    
    try {
      const resolutionRate = state.resolved / state.incidents;
      const radius = Math.sqrt(state.incidents) / 20;
      const isSelected = selectedState?.state === state.state;
      
      const markerOptions = {
        position: state.coordinates,
        icon: {
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${radius * 2}px" height="${radius * 2}px"><circle cx="50" cy="50" r="40" fill="rgba(${Math.floor(255 * (1 - resolutionRate))}, ${Math.floor(255 * resolutionRate)}, 100, 0.7)" stroke="${isSelected ? 'white' : 'none'}" stroke-width="${isSelected ? '4' : '0'}"/></svg>`,
          size: { width: radius * 2, height: radius * 2 },
          anchor: { x: radius, y: radius }
        },
        popupOptions: {
          content: `<b>${state.state}</b><br>Incidents: ${state.incidents}<br>Resolved: ${state.resolved}`
        },
        map: mapInstanceRef.current
      };

      // Create marker based on API version
      let marker = null;
      if (version === 'modern' && window.MapmyIndia.map) {
        marker = new window.MapmyIndia.map.Marker(markerOptions);
      } else if (version === 'legacy') {
        marker = new window.MapmyIndia.Marker(markerOptions);
      }
      
      return marker;
    } catch (error) {
      console.error('Error creating marker:', error);
      return null;
    }
  };

  const initializeMap = () => {
    setIsLoading(true);
    
    if (!window.MapmyIndia) {
      console.error('MapMyIndia API not loaded');
      setMapError('Map API not loaded. Please refresh the page or check your internet connection.');
      setIsLoading(false);
      return;
    }

    if (!mapRef.current) {
      console.error('Map container not found');
      setIsLoading(false);
      return;
    }

    try {
      // Clean up previous map instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }
      }

      console.log('Initializing map with container:', mapRef.current);
      
      const mapOptions = {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        hybrid: true
      };

      mapInstanceRef.current = new window.MapmyIndia.Map(mapRef.current, mapOptions);
      
      if (mapInstanceRef.current) {
        console.log('Map created successfully');
        setMapInitialized(true);
        setMapError(null);
        setMapVisible(true);
        
        // Detect API version
        detectApiVersion();
        
        // Add a slight delay to ensure map is fully rendered before updating view
        setTimeout(() => {
          updateMapView();
          setIsLoading(false);
        }, 500);
      } else {
        console.error('Map instantiation failed');
        setMapError('Failed to initialize map. Please refresh the page.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initializing MapMyIndia map:', error);
      setMapError('Error initializing map. Please refresh the page.');
      setIsLoading(false);
    }
  };

  const updateMapView = () => {
    import('@/data/crimeMapData').then(({ stateData }) => {
      if (!mapInstanceRef.current || !mapInitialized) {
        console.warn('Map not initialized yet, cannot update view');
        return;
      }

      try {
        // Clean up existing markers and polygons
        if (typeof mapInstanceRef.current.removeAllMarkers === 'function') {
          mapInstanceRef.current.removeAllMarkers();
        }
        
        if (typeof mapInstanceRef.current.removeAllPolygons === 'function') {
          mapInstanceRef.current.removeAllPolygons();
        }

        // Detect API version before rendering
        const version = detectApiVersion();
        
        if (mapView === 'bubble') {
          renderBubbleView(stateData, version);
        } else {
          renderHeatmapView(stateData, version);
        }
      } catch (error) {
        console.error('Error updating map view:', error);
      }
    });
  };

  // Render bubble view (circles for each state)
  const renderBubbleView = (stateData: CrimeData[], version: 'modern' | 'legacy' | null) => {
    if (!version) {
      console.error('Cannot detect MapmyIndia API version');
      setMapError('Map API version not detected. Please refresh the page.');
      return;
    }
    
    let markersCreated = 0;
    
    stateData.forEach((state) => {
      if (!state.coordinates) return;
      
      const marker = createMarker(state, version);
      
      if (marker) {
        markersCreated++;
        try {
          if (marker && typeof marker.addListener === 'function') {
            marker.addListener('click', () => {
              setSelectedState(state);
            });
          }
        } catch (e) {
          console.warn('Could not add marker click listener:', e);
        }
      }
    });
    
    console.log(`Created ${markersCreated} markers with API version: ${version}`);
    
    if (markersCreated === 0) {
      toast({
        title: "Warning",
        description: "Failed to display map markers. API might be incompatible.",
        variant: "default"
      });
    }
  };

  // Render heatmap view (intensity polygons)
  const renderHeatmapView = (stateData: CrimeData[], version: 'modern' | 'legacy' | null) => {
    if (!version) {
      renderBubbleView(stateData, version);
      return;
    }
    
    // Check if Polygon constructor is available
    const hasPolygon = 
      (version === 'modern' && window.MapmyIndia.map && window.MapmyIndia.map.Polygon) ||
      (version === 'legacy' && window.MapmyIndia.Polygon);
    
    if (!hasPolygon) {
      console.warn('MapMyIndia Polygon constructor not available, falling back to bubble view');
      toast({
        title: "Heatmap view unavailable",
        description: "Falling back to bubble view due to API limitations",
        variant: "default"
      });
      // Fall back to bubble view
      renderBubbleView(stateData, version);
      return;
    }

    let polygonsCreated = 0;
    
    stateData.forEach((state) => {
      if (!state.coordinates) return;
      
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
          strokeWeight: 1,
          map: mapInstanceRef.current
        };
        
        if (version === 'modern' && window.MapmyIndia.map && window.MapmyIndia.map.Polygon) {
          new window.MapmyIndia.map.Polygon(polygonOptions);
          polygonsCreated++;
        } else if (version === 'legacy' && window.MapmyIndia.Polygon) {
          new window.MapmyIndia.Polygon(polygonOptions);
          polygonsCreated++;
        }
      } catch (polygonError) {
        console.error('Error creating heatmap polygon:', polygonError);
      }
    });
    
    console.log(`Created ${polygonsCreated} polygons with API version: ${version}`);
    
    if (polygonsCreated === 0) {
      renderBubbleView(stateData, version);
    }
  };

  const handleResetMap = () => {
    setIsLoading(true);
    initializeMap();
  };

  return (
    <div className="lg:col-span-3 futuristic-card !p-0 relative h-[500px]">
      <div 
        ref={mapRef} 
        className="absolute inset-0 w-full h-full rounded-lg overflow-hidden" 
        id="map-container"
        style={{ background: '#f1f5f9' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-lg">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-400 mb-4">{mapError}</p>
            <Button onClick={handleResetMap}>Reload Map</Button>
          </div>
        </div>
      )}
      
      {selectedState && (
        <div className="absolute bottom-4 right-4 futuristic-card !p-4 max-w-xs w-full mx-auto animate-fade-in bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <h3 className="font-mono text-lg">{selectedState.state}</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">REPORTED</p>
              <p className="font-bold text-red-600 dark:text-red-400">{formatNumber(selectedState.incidents)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">RESOLVED</p>
              <p className="font-bold text-green-600 dark:text-green-400">{formatNumber(selectedState.resolved)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">RESOLUTION</p>
              <p className="font-bold">
                {Math.round((selectedState.resolved / selectedState.incidents) * 100)}%
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">TOP SCAM</p>
              <p className="font-bold">{selectedState.topType}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded p-2 z-10">
        <p className="text-xs font-mono">MapMyIndia Interactive Map</p>
        <p className="text-xs font-mono opacity-50">API: {apiVersion}</p>
      </div>
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 dark:bg-black/80 backdrop-blur-sm"
          onClick={handleResetMap}
        >
          <Undo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapController;

