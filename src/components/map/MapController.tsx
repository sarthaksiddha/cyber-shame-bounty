
import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Undo } from 'lucide-react';
import { Button } from '../ui/button';
import { CrimeData } from '@/types/mapTypes';
import { generateCirclePoints, formatNumber } from '@/utils/mapUtils';
import { 
  detectApiVersion, 
  createMarker, 
  createPolygon, 
  isPolygonSupported,
  initializeMapInstance 
} from '@/utils/mapApiUtils';
import { toast } from '../ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

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
  const [apiVersion, setApiVersion] = useState<'legacy' | 'modern' | 'leaflet' | 'mappls' | 'maplibre' | null>(null);
  const [markersCreated, setMarkersCreated] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Function to initialize the map
  const initializeMap = () => {
    setIsLoading(true);
    setMarkersCreated(0);
    
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
      
      // Use our enhanced initializer
      mapInstanceRef.current = initializeMapInstance(mapRef.current);
      
      if (mapInstanceRef.current) {
        console.log('Map created successfully');
        setMapInitialized(true);
        setMapError(null);
        setMapVisible(true);
        
        // Detect API version
        const version = detectApiVersion();
        setApiVersion(version);
        
        // Add a slight delay to ensure map is fully rendered before updating view
        setTimeout(() => {
          updateMapView();
          setIsLoading(false);
        }, 500);
      } else {
        console.error('Map instantiation failed');
        // Try again with a different method if we haven't tried too many times
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          console.log(`Retry ${retryCount + 1} of 3...`);
          
          // Different initialization approach
          setTimeout(() => {
            if (mapRef.current) {
              // Ensure we have an ID
              if (!mapRef.current.id) {
                mapRef.current.id = 'map-container-' + Date.now();
              }
              
              try {
                if (window.MapmyIndia.L) {
                  // Try Leaflet method
                  mapInstanceRef.current = window.MapmyIndia.L.map(mapRef.current.id, {
                    center: [20.5937, 78.9629],
                    zoom: 5
                  });
                  
                  setMapInitialized(true);
                  setMapError(null);
                  setApiVersion('leaflet');
                  updateMapView();
                  setIsLoading(false);
                } else {
                  throw new Error('Fallback initialization also failed');
                }
              } catch (retryError) {
                setMapError(`Failed to initialize map after multiple attempts. Please refresh the page.`);
                setIsLoading(false);
              }
            }
          }, 1000);
        } else {
          setMapError('Failed to initialize map. Please refresh the page.');
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error initializing MapMyIndia map:', error);
      setMapError(`Error initializing map: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Initialize map when component mounts or becomes visible
  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current || mapInitialized) return;
      
      // Use a timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        if (!mapInitialized && mapRef.current) {
          initializeMap();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    };

    // Load map immediately and also when window is resized
    loadMap();
    
    // Add resize event listener to re-initialize map if window size changes
    window.addEventListener('resize', loadMap);
    
    return () => {
      window.removeEventListener('resize', loadMap);
    };
  }, [mapRef.current, mapInitialized]);

  // Observer to detect when map is in viewport
  useEffect(() => {
    if (mapInitialized) return;
    
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !mapInitialized) {
          setMapVisible(true);
          observer.unobserve(entry.target);

          // Short delay to ensure DOM is ready
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
  }, [mapInitialized]);

  // Update map view when view type or selected state changes
  useEffect(() => {
    if (mapVisible && mapInstanceRef.current && mapInitialized) {
      updateMapView();
    }
  }, [mapView, selectedState, mapVisible, mapInitialized]);

  // Function to create marker for a state
  const createStateMarker = (state: CrimeData) => {
    if (!state.coordinates || !mapInstanceRef.current) return null;
    
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
      }
      
      return marker;
    } catch (error) {
      console.error('Error creating state marker:', error);
      return null;
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
        // Different APIs have different cleanup methods
        // We'll let the map reinitialize for simplicity
        
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

  const handleResetMap = () => {
    setIsLoading(true);
    setMapInitialized(false);
    setRetryCount(0);
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
      
      {!isLoading && mapInitialized && markersCreated === 0 && (
        <div className="absolute top-16 left-4 right-4 z-10">
          <Alert variant="destructive" className="bg-white/90 dark:bg-gray-900/90 border-red-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Map API Compatibility Issue</AlertTitle>
            <AlertDescription>
              Failed to display map markers. The API might be incompatible with this browser.
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleResetMap}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
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
        <p className="text-xs font-mono opacity-50">API: {apiVersion || 'detecting...'}</p>
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
