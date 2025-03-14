import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Undo } from 'lucide-react';
import { Button } from '../ui/button';
import { CrimeData } from '@/types/mapTypes';
import { generateCirclePoints, formatNumber } from '@/utils/mapUtils';

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

  useEffect(() => {
    if (!mapRef.current) return;
    
    const timer = setTimeout(() => {
      if (!mapInitialized && mapRef.current) {
        initializeMap();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [mapRef.current]);

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

  useEffect(() => {
    if (mapVisible && mapInstanceRef.current && mapInitialized) {
      updateMapView();
    }
  }, [mapView, selectedState, mapVisible, mapInitialized]);

  const initializeMap = () => {
    if (!window.MapmyIndia) {
      console.error('MapMyIndia API not loaded');
      setMapError('Map API not loaded. Please refresh the page or check your internet connection.');
      return;
    }

    if (!mapRef.current) {
      console.error('Map container not found');
      return;
    }

    try {
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
        
        setTimeout(() => {
          updateMapView();
        }, 500);
      } else {
        console.error('Map instantiation failed');
        setMapError('Failed to initialize map. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error initializing MapMyIndia map:', error);
      setMapError('Error initializing map. Please refresh the page.');
    }
  };

  const updateMapView = () => {
    import('@/data/crimeMapData').then(({ stateData }) => {
      if (!mapInstanceRef.current || !mapInitialized) {
        console.warn('Map not initialized yet, cannot update view');
        return;
      }

      try {
        if (typeof mapInstanceRef.current.removeAllMarkers === 'function') {
          mapInstanceRef.current.removeAllMarkers();
        }
        
        if (typeof mapInstanceRef.current.removeAllPolygons === 'function') {
          mapInstanceRef.current.removeAllPolygons();
        }

        if (mapView === 'bubble') {
          stateData.forEach((state) => {
            if (!state.coordinates) return;

            const resolutionRate = state.resolved / state.incidents;
            const radius = Math.sqrt(state.incidents) / 20;
            const isSelected = selectedState?.state === state.state;

            try {
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

              const marker = new window.MapmyIndia.Marker(markerOptions);
              
              try {
                if (marker && typeof marker.addListener === 'function') {
                  marker.addListener('click', () => {
                    setSelectedState(state);
                  });
                }
              } catch (e) {
                console.warn('Could not add marker click listener:', e);
              }
            } catch (markerError) {
              console.error('Error creating marker:', markerError);
            }
          });
        } else {
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
              
              new window.MapmyIndia.Polygon(polygonOptions);
            } catch (polygonError) {
              console.error('Error creating heatmap polygon:', polygonError);
            }
          });
        }
      } catch (error) {
        console.error('Error updating map view:', error);
      }
    });
  };

  const handleResetMap = () => {
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
