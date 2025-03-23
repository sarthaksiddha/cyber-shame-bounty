
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
    else if (apiVersion === 'modern') {
      mapInstance = new window.MapmyIndia.Map(containerElement, mergedOptions);
      console.log('Created map with modern API');
    }
    else if (apiVersion === 'leaflet' && window.MapmyIndia.L) {
      if (window.MapmyIndia.L.map) {
        // For Leaflet API, we need to ensure we have the proper constructor signature
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        
        // Set ID if not already set
        if (!containerElement.id) {
          containerElement.id = containerId;
        }
        
        // Create a new Leaflet map instance using the proper constructor with 'new'
        mapInstance = new window.MapmyIndia.L.map(containerId, mergedOptions);
        console.log('Created map with Leaflet API');
      } else {
        // Legacy Leaflet implementation
        const containerId = containerElement.id || `map-container-${Date.now()}`;
        containerElement.id = containerId;
        
        // Some versions of Leaflet API initialize directly on the MapmyIndia object
        if (typeof window.MapmyIndia.Map === 'function') {
          mapInstance = new window.MapmyIndia.Map(containerId, mergedOptions);
          console.log('Created map with legacy Leaflet API');
        }
      }
    }
    else if (apiVersion === 'legacy') {
      mapInstance = new window.MapmyIndia.Map(containerElement, mergedOptions);
      console.log('Created map with legacy API');
    }
    
    if (!mapInstance) {
      console.warn('Could not create map with detected API, trying direct Map constructor');
      // Last resort - direct constructor
      mapInstance = new window.MapmyIndia.Map(containerElement, mergedOptions);
    }
  } catch (error) {
    console.error('Error initializing map:', error);
    return null;
  }

  return mapInstance;
};
