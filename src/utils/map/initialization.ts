
/**
 * Utilities for initializing the map
 */

import { detectApiVersion } from './detection';

// Initialize map based on detected API version
export const initializeMapInstance = (
  container: HTMLElement | string,
  options: any = {}
): any => {
  if (!window.MapmyIndia) {
    console.error('MapMyIndia API not loaded');
    
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
        
        // Create a new Leaflet map instance using the proper constructor with 'new'
        mapInstance = new window.MapmyIndia.L.map(containerId, mergedOptions);
        console.log('Created map with Leaflet API');
        
        // Add a tile layer to actually show the map
        if (window.MapmyIndia.L.tileLayer) {
          window.MapmyIndia.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstance);
        }
      } else if (window.L) {
        // Standard Leaflet fallback
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        containerElement.id = containerId;
        
        mapInstance = new window.L.map(containerId, mergedOptions);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        console.log('Created map with standard Leaflet');
      }
      // Legacy Leaflet implementation
      else if (typeof window.MapmyIndia.Map === 'function') {
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        containerElement.id = containerId;
        
        mapInstance = new window.MapmyIndia.Map(containerId, mergedOptions);
        console.log('Created map with legacy Leaflet API');
      }
    }
    else if (apiVersion === 'legacy') {
      mapInstance = new window.MapmyIndia.Map(containerElement, mergedOptions);
      console.log('Created map with legacy API');
    }
    
    // Fallback to a basic implementation if we couldn't create a map
    if (!mapInstance) {
      console.warn('Could not create map with detected API, using fallback implementation');
      
      // Create a mockup map as last resort
      const fallbackMap = document.createElement('div');
      fallbackMap.style.width = '100%';
      fallbackMap.style.height = '100%';
      fallbackMap.style.background = '#f1f5f9';
      
      const mapImage = document.createElement('img');
      mapImage.src = '/lovable-uploads/923be7fe-2719-489e-972f-874cdb5a0304.png';
      mapImage.style.width = '100%';
      mapImage.style.height = 'auto';
      mapImage.style.position = 'absolute';
      mapImage.style.top = '50%';
      mapImage.style.left = '50%';
      mapImage.style.transform = 'translate(-50%, -50%)';
      mapImage.style.maxWidth = '90%';
      mapImage.style.maxHeight = '90%';
      mapImage.style.objectFit = 'contain';
      
      fallbackMap.appendChild(mapImage);
      containerElement.appendChild(fallbackMap);
      
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
    return null;
  }

  return mapInstance;
};
