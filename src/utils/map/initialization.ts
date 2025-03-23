
/**
 * Utilities for initializing the map
 */

// Initialize map based on detected API version
export const initializeMapInstance = (
  container: HTMLElement | string,
  options: any = {}
): any => {
  if (!window.MapmyIndia) {
    console.error('MapMyIndia API not loaded');
    
    // Try using standard Leaflet as a fallback
    if (window.L) {
      console.log('Falling back to standard Leaflet');
      const containerElement = typeof container === 'string' 
        ? document.getElementById(container)
        : container;
      
      if (!containerElement) {
        console.error('Map container element not found');
        return null;
      }
      
      const containerId = containerElement.id || `map-container-${Date.now()}`;
      if (!containerElement.id) {
        containerElement.id = containerId;
      }
      
      // Clear any previous content
      containerElement.innerHTML = '';
      
      // Create standard Leaflet map
      try {
        const mapInstance = window.L.map(containerId, {
          center: [20.5937, 78.9629], // Center of India
          zoom: 5,
          zoomControl: true,
          ...options
        });
        
        // Add OpenStreetMap tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        
        console.log('Successfully created fallback Leaflet map');
        return mapInstance;
      } catch (error) {
        console.error('Error creating fallback Leaflet map:', error);
      }
    }
    
    // For development/testing environments, create a mock map
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating mock map for development');
      const mockMap = {
        _container: typeof container === 'string' ? document.getElementById(container) : container,
        setView: () => mockMap,
        addLayer: () => mockMap,
        remove: () => {},
        on: () => mockMap,
        getCenter: () => ({ lat: 20.5937, lng: 78.9629 }),
        getZoom: () => 5
      };
      return mockMap;
    }
    
    return null;
  }

  const defaultOptions = {
    center: [20.5937, 78.9629], // Default center (India)
    zoom: 5,
    zoomControl: true
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const apiVersion = detectApiVersion();
  let mapInstance = null;

  console.log(`Initializing map with API version: ${apiVersion}`);

  try {
    // Handle both HTMLElement and string (id) as container
    const containerElement = typeof container === 'string' 
      ? document.getElementById(container)
      : container;
    
    if (!containerElement) {
      console.error('Map container element not found');
      return null;
    }

    // Clear any previous content
    containerElement.innerHTML = '';
    
    // Create map instance based on API version
    if (apiVersion === 'mappls' && window.MapmyIndia.mappls?.Map) {
      mapInstance = new window.MapmyIndia.mappls.Map(containerElement, mergedOptions);
      console.log('Created map with Mappls API');
    } 
    else if (apiVersion === 'maplibre') {
      const maplibre = window.MapmyIndia.maplibregl || window.maplibregl;
      mapInstance = new maplibre.Map({
        container: containerElement,
        style: 'https://apis.mappls.com/advancedmaps/api/key/map_styles',
        center: mergedOptions.center,
        zoom: mergedOptions.zoom
      });
      console.log('Created map with MapLibre API');
    }
    else if (apiVersion === 'modern' && window.MapmyIndia.Map) {
      mapInstance = new window.MapmyIndia.Map(containerElement, mergedOptions);
      console.log('Created map with modern API');
    }
    else if (apiVersion === 'leaflet') {
      if (window.MapmyIndia.L && window.MapmyIndia.L.map) {
        // For Leaflet API, we need to ensure we have the proper constructor signature
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        
        // Set ID if not already set
        if (!containerElement.id) {
          containerElement.id = containerId;
        }
        
        try {
          // Create a new Leaflet map instance using the proper constructor with 'new'
          mapInstance = new window.MapmyIndia.L.map(containerId, mergedOptions);
          console.log('Created map with Leaflet API');
          
          // Add a tile layer to actually show the map
          if (window.MapmyIndia.L.tileLayer) {
            window.MapmyIndia.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance);
          }
        } catch (error) {
          console.error('Error creating MapmyIndia Leaflet map:', error);
          throw error; // Let it fall through to the fallback
        }
      } else if (window.L) {
        // Standard Leaflet fallback
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        containerElement.id = containerId;
        
        try {
          mapInstance = new window.L.map(containerId, mergedOptions);
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstance);
          console.log('Created map with standard Leaflet');
        } catch (error) {
          console.error('Error creating standard Leaflet map:', error);
          throw error; // Let it fall through to the fallback
        }
      }
      // Legacy Leaflet implementation
      else if (typeof window.MapmyIndia.Map === 'function') {
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        containerElement.id = containerId;
        
        try {
          mapInstance = new window.MapmyIndia.Map(containerId, mergedOptions);
          console.log('Created map with legacy Leaflet API');
        } catch (error) {
          console.error('Error creating legacy MapmyIndia map:', error);
          throw error; // Let it fall through to the fallback
        }
      }
    }
    else if (apiVersion === 'legacy') {
      try {
        mapInstance = new window.MapmyIndia.Map(containerElement, mergedOptions);
        console.log('Created map with legacy API');
      } catch (error) {
        console.error('Error creating legacy map:', error);
        throw error; // Let it fall through to the fallback
      }
    }
    
    // Fallback to a basic implementation if we couldn't create a map
    if (!mapInstance) {
      console.warn('Could not create map with detected API, using fallback implementation');
      
      // Try using pure Leaflet first if available
      if (window.L) {
        try {
          const containerId = containerElement.id || `map-container-${Date.now()}`;
          if (!containerElement.id) {
            containerElement.id = containerId;
          }
          
          mapInstance = new window.L.map(containerId, mergedOptions);
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstance);
          console.log('Created map with emergency Leaflet fallback');
          return mapInstance;
        } catch (error) {
          console.error('Failed to create emergency Leaflet fallback:', error);
        }
      }
      
      // Last resort visual fallback
      console.warn('Using static map fallback as last resort');
      
      // Create a mockup map as last resort
      const fallbackMap = document.createElement('div');
      fallbackMap.style.width = '100%';
      fallbackMap.style.height = '100%';
      fallbackMap.style.background = '#f1f5f9';
      
      // Add an informative message
      const errorMessage = document.createElement('div');
      errorMessage.style.position = 'absolute';
      errorMessage.style.top = '20%';
      errorMessage.style.left = '50%';
      errorMessage.style.transform = 'translate(-50%, -50%)';
      errorMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      errorMessage.style.padding = '15px';
      errorMessage.style.borderRadius = '5px';
      errorMessage.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      errorMessage.style.textAlign = 'center';
      errorMessage.style.maxWidth = '80%';
      errorMessage.innerHTML = `
        <div style="color: #e53e3e; margin-bottom: 10px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div style="font-weight: bold; margin-bottom: 5px;">Map API Compatibility Issue</div>
        <div style="font-size: 14px; color: #4a5568; margin-bottom: 10px;">Failed to display map markers. The API might be incompatible with this browser.</div>
        <button id="retry-map-btn" style="background-color: #3182ce; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Try Again</button>
      `;
      
      fallbackMap.appendChild(errorMessage);
      containerElement.appendChild(fallbackMap);
      
      // Add event listener to retry button
      setTimeout(() => {
        const retryButton = document.getElementById('retry-map-btn');
        if (retryButton) {
          retryButton.addEventListener('click', () => {
            containerElement.innerHTML = '';
            initializeMapInstance(container, options);
          });
        }
      }, 0);
      
      // Return a simple object with required methods to avoid errors
      mapInstance = {
        _container: containerElement,
        remove: () => { containerElement.innerHTML = ''; },
        getCenter: () => ({ lat: 20.5937, lng: 78.9629 }),
        getZoom: () => 5,
        setView: () => mapInstance,
        on: () => mapInstance
      };
    }
  } catch (error) {
    console.error('Error initializing map:', error);
    
    // Final failsafe - try standard Leaflet directly
    if (window.L) {
      try {
        const containerElement = typeof container === 'string' 
          ? document.getElementById(container)
          : container;
        
        if (!containerElement) return null;
        
        // Clear container
        containerElement.innerHTML = '';
        
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        if (!containerElement.id) {
          containerElement.id = containerId;
        }
        
        const mapInstance = new window.L.map(containerId, {
          center: [20.5937, 78.9629],
          zoom: 5,
          ...options
        });
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        
        console.log('Created map with failsafe Leaflet');
        return mapInstance;
      } catch (finalError) {
        console.error('Final Leaflet fallback also failed:', finalError);
        return null;
      }
    }
    
    return null;
  }

  return mapInstance;
};
