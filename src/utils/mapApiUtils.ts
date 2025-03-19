
/**
 * Utility functions for working with the MapMyIndia API
 */

// Detects which API version we're using
export const detectApiVersion = (): 'modern' | 'legacy' | 'leaflet' | null => {
  if (!window.MapmyIndia) {
    console.error('MapMyIndia API not loaded');
    return null;
  }
  
  // Check for modern API (MapmyIndia.map.Marker structure)
  if (window.MapmyIndia.map && typeof window.MapmyIndia.map.Marker === 'function') {
    console.log('Using modern MapmyIndia API');
    return 'modern';
  } 
  // Check for leaflet-based API
  else if (window.MapmyIndia.L && window.MapmyIndia.L.marker) {
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
    // Force legacy mode as a fallback
    return 'legacy';
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
    if (apiVersion === 'modern' && window.MapmyIndia.map?.Marker) {
      options.map = map;
      marker = new window.MapmyIndia.map.Marker(options);
      console.log('Created marker with modern API');
    } 
    else if (apiVersion === 'leaflet' && window.MapmyIndia.L?.marker) {
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
    }
    else if (apiVersion === 'legacy' && window.MapmyIndia.Marker) {
      options.map = map;
      marker = new window.MapmyIndia.Marker(options);
      console.log('Created marker with legacy API');
    } 
    else {
      console.warn('Could not create marker: API constructor not found');
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
    if (apiVersion === 'modern' && window.MapmyIndia.map?.Polygon) {
      options.map = map;
      polygon = new window.MapmyIndia.map.Polygon(options);
      console.log('Created polygon with modern API');
    } 
    else if (apiVersion === 'leaflet' && window.MapmyIndia.L?.polygon) {
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
    }
    else if (apiVersion === 'legacy' && window.MapmyIndia.Polygon) {
      options.map = map;
      polygon = new window.MapmyIndia.Polygon(options);
      console.log('Created polygon with legacy API');
    } 
    else {
      console.warn('Could not create polygon: API constructor not found');
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
    (apiVersion === 'modern' && !!window.MapmyIndia.map?.Polygon) ||
    (apiVersion === 'legacy' && !!window.MapmyIndia.Polygon) ||
    (apiVersion === 'leaflet' && !!window.MapmyIndia.L?.polygon)
  );
};
