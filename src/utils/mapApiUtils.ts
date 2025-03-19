
/**
 * Utility functions for working with the MapMyIndia API
 */

// Detects which API version we're using
export const detectApiVersion = (): 'modern' | 'legacy' | 'leaflet' | 'mappls' | 'maplibre' | null => {
  if (!window.MapmyIndia) {
    console.error('MapMyIndia API not loaded');
    return null;
  }
  
  // Check for mappls V2/V3 API
  if (window.MapmyIndia.mappls && typeof window.MapmyIndia.mappls.Map === 'function') {
    console.log('Using mappls V2/V3 API');
    return 'mappls';
  }
  // Check for maplibre GL integration
  else if (window.MapmyIndia.maplibregl || window.maplibregl) {
    console.log('Using MapLibre GL API');
    return 'maplibre';
  }
  // Check for modern API (MapmyIndia.map.Marker structure)
  else if (window.MapmyIndia.map && typeof window.MapmyIndia.map.Marker === 'function') {
    console.log('Using modern MapmyIndia API');
    return 'modern';
  } 
  // Check for leaflet-based API
  else if (window.MapmyIndia.L) {
    console.log('Using Leaflet-based MapmyIndia API');
    return 'leaflet';
  }
  // Check for legacy API (MapmyIndia.Marker structure)
  else if (typeof window.MapmyIndia.Marker === 'function') {
    console.log('Using legacy MapmyIndia API');
    return 'legacy';
  } 
  // Fallback when structure is unexpected
  else {
    console.warn('MapmyIndia API loaded with unknown structure - trying Leaflet fallback');
    return 'leaflet'; // Default to leaflet which is more common
  }
};

// Creates a marker using the appropriate API version
export const createMarker = (
  options: any, 
  map: any
): any => {
  if (!window.MapmyIndia) return null;
  
  const apiVersion = detectApiVersion();
  let marker = null;
  
  try {
    // Create marker based on API version
    if (apiVersion === 'mappls' && window.MapmyIndia.mappls?.Marker) {
      options.map = map;
      marker = new window.MapmyIndia.mappls.Marker(options);
      console.log('Created marker with mappls API');
    }
    else if (apiVersion === 'maplibre') {
      const maplibre = window.MapmyIndia.maplibregl || window.maplibregl;
      marker = new maplibre.Marker({
        color: options.icon?.url || '#FF0000',
        draggable: options.draggable
      }).setLngLat(options.position);
      
      marker.addTo(map);
      console.log('Created marker with MapLibre API');
    }
    else if (apiVersion === 'modern' && window.MapmyIndia.map?.Marker) {
      options.map = map;
      marker = new window.MapmyIndia.map.Marker(options);
      console.log('Created marker with modern API');
    } 
    else if (apiVersion === 'leaflet' && window.MapmyIndia.L) {
      // Try to create Leaflet marker
      if (window.MapmyIndia.L.marker) {
        // Leaflet API has different structure
        const position = options.position;
        marker = window.MapmyIndia.L.marker(position, {
          icon: options.icon,
          draggable: options.draggable
        });
        
        if (marker) {
          marker.addTo(map);
          
          // Add popup if specified
          if (options.popupOptions && options.popupOptions.content) {
            marker.bindPopup(options.popupOptions.content);
          }
          console.log('Created marker with Leaflet API');
        }
      } else if (window.MapmyIndia.L.layerGroup) {
        // Alternative method with layer groups
        console.log('Attempting to create marker with Leaflet layerGroup');
        return map; // Just return the map as we can't create markers in this version
      }
    }
    else if (apiVersion === 'legacy' && window.MapmyIndia.Marker) {
      options.map = map;
      marker = new window.MapmyIndia.Marker(options);
      console.log('Created marker with legacy API');
    } 
    else {
      console.warn('Could not create marker: API constructor not found. Using fallback...');
      // Last resort - try to access a potentially different structure
      if (typeof map.addMarker === 'function') {
        marker = map.addMarker(options.position);
        console.log('Created marker with fallback method');
      }
    }
  } catch (error) {
    console.error('Error creating marker:', error);
  }
  
  return marker;
};

// Creates a polygon using the appropriate API version
export const createPolygon = (
  options: any, 
  map: any
): any => {
  if (!window.MapmyIndia) return null;
  
  const apiVersion = detectApiVersion();
  let polygon = null;
  
  try {
    // Create polygon based on API version
    if (apiVersion === 'mappls' && window.MapmyIndia.mappls?.Polygon) {
      options.map = map;
      polygon = new window.MapmyIndia.mappls.Polygon(options);
      console.log('Created polygon with mappls API');
    }
    else if (apiVersion === 'maplibre') {
      const maplibre = window.MapmyIndia.maplibregl || window.maplibregl;
      if (map.getSource('polygon-source')) {
        map.removeSource('polygon-source');
      }
      
      map.addSource('polygon-source', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [options.paths[0]]
          }
        }
      });
      
      map.addLayer({
        'id': 'polygon-layer',
        'type': 'fill',
        'source': 'polygon-source',
        'layout': {},
        'paint': {
          'fill-color': options.fillColor || '#FF0000',
          'fill-opacity': options.fillOpacity || 0.5
        }
      });
      
      console.log('Created polygon with MapLibre API');
      return map; // Return map as reference
    }
    else if (apiVersion === 'modern' && window.MapmyIndia.map?.Polygon) {
      options.map = map;
      polygon = new window.MapmyIndia.map.Polygon(options);
      console.log('Created polygon with modern API');
    } 
    else if (apiVersion === 'leaflet' && window.MapmyIndia.L) {
      if (window.MapmyIndia.L.polygon) {
        polygon = window.MapmyIndia.L.polygon(options.paths[0], {
          fillColor: options.fillColor,
          fillOpacity: options.fillOpacity,
          color: options.strokeColor,
          opacity: options.strokeOpacity,
          weight: options.strokeWeight
        });
        
        if (polygon) {
          polygon.addTo(map);
          console.log('Created polygon with Leaflet API');
        }
      } else {
        console.log('Leaflet polygon constructor not available');
        return null;
      }
    }
    else if (apiVersion === 'legacy' && window.MapmyIndia.Polygon) {
      options.map = map;
      polygon = new window.MapmyIndia.Polygon(options);
      console.log('Created polygon with legacy API');
    } 
    else {
      console.warn('Could not create polygon: API constructor not found. Using fallback...');
      // Fallback - try to access a potentially different structure
      if (typeof map.addPolygon === 'function') {
        polygon = map.addPolygon(options.paths[0]);
        console.log('Created polygon with fallback method');
      }
    }
  } catch (error) {
    console.error('Error creating polygon:', error);
  }
  
  return polygon;
};

// Checks if the Polygon constructor is available
export const isPolygonSupported = (): boolean => {
  const apiVersion = detectApiVersion();
  
  return (
    (apiVersion === 'mappls' && !!window.MapmyIndia.mappls?.Polygon) ||
    (apiVersion === 'maplibre') || // Maplibre can always create polygons
    (apiVersion === 'modern' && !!window.MapmyIndia.map?.Polygon) ||
    (apiVersion === 'legacy' && !!window.MapmyIndia.Polygon) ||
    (apiVersion === 'leaflet' && !!window.MapmyIndia.L?.polygon)
  );
};

// Initialize map based on detected API version
export const initializeMapInstance = (
  container: HTMLElement,
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
    if (apiVersion === 'mappls' && window.MapmyIndia.mappls?.Map) {
      mapInstance = new window.MapmyIndia.mappls.Map(container, mergedOptions);
      console.log('Created map with Mappls API');
    } 
    else if (apiVersion === 'maplibre') {
      const maplibre = window.MapmyIndia.maplibregl || window.maplibregl;
      mapInstance = new maplibre.Map({
        container: container,
        style: 'https://apis.mappls.com/advancedmaps/api/key/map_styles',
        center: mergedOptions.center,
        zoom: mergedOptions.zoom
      });
      console.log('Created map with MapLibre API');
    }
    else if (apiVersion === 'modern') {
      mapInstance = new window.MapmyIndia.Map(container, mergedOptions);
      console.log('Created map with modern API');
    }
    else if (apiVersion === 'leaflet' && window.MapmyIndia.L) {
      if (window.MapmyIndia.L.map) {
        mapInstance = new window.MapmyIndia.L.map(container, mergedOptions);
      } else {
        // DOM ID-based initialization for some Leaflet versions
        const containerId = container.id || 'map-container';
        container.id = containerId;
        
        // Some versions of Leaflet API initialize directly on the MapmyIndia object
        if (typeof window.MapmyIndia.Map === 'function') {
          mapInstance = new window.MapmyIndia.Map(containerId, mergedOptions);
        }
      }
      console.log('Created map with Leaflet API');
    }
    else if (apiVersion === 'legacy') {
      mapInstance = new window.MapmyIndia.Map(container, mergedOptions);
      console.log('Created map with legacy API');
    }
    
    if (!mapInstance) {
      console.warn('Could not create map with detected API, trying direct Map constructor');
      // Last resort - direct constructor
      mapInstance = new window.MapmyIndia.Map(container, mergedOptions);
    }
  } catch (error) {
    console.error('Error initializing map:', error);
    return null;
  }

  return mapInstance;
};
