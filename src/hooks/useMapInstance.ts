
import { useEffect, useRef, useState } from 'react';
import { detectApiVersion, initializeMapInstance } from '@/utils/mapApiUtils';
import { toast } from '@/components/ui/use-toast';

export function useMapInstance() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiVersion, setApiVersion] = useState<'legacy' | 'modern' | 'leaflet' | 'mappls' | 'maplibre' | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Function to initialize the map
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
      
      // Use our enhanced initializer
      const mapInstance = initializeMapInstance(mapRef.current);
      mapInstanceRef.current = mapInstance;
      
      if (mapInstanceRef.current) {
        console.log('Map created successfully');
        setMapInitialized(true);
        setMapError(null);
        setMapVisible(true);
        
        // Detect API version
        const version = detectApiVersion();
        setApiVersion(version);
        console.log('API Version detected:', version);
        
        // Add a slight delay to ensure map is fully rendered before updating view
        setTimeout(() => {
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
                  console.log('Trying Leaflet initialization');
                  mapInstanceRef.current = new window.MapmyIndia.L.map(mapRef.current.id, {
                    center: [20.5937, 78.9629],
                    zoom: 5
                  });
                  
                  setMapInitialized(true);
                  setMapError(null);
                  setApiVersion('leaflet');
                  setIsLoading(false);
                } else {
                  throw new Error('Fallback initialization also failed');
                }
              } catch (retryError) {
                console.error('Retry error:', retryError);
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

  // Handle map initialization based on visibility
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

  // Function to reset the map
  const handleResetMap = () => {
    setIsLoading(true);
    setMapInitialized(false);
    setRetryCount(0);
    initializeMap();
  };

  return {
    mapRef,
    mapInstanceRef,
    mapInitialized,
    mapError,
    mapVisible,
    isLoading,
    apiVersion,
    handleResetMap,
    setIsLoading
  };
}
