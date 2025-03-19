
/**
 * Utility functions for working with the MapMyIndia API
 */

// Detects whether we're using the modern or legacy API version
export const detectApiVersion = (): 'modern' | 'legacy' | null => {
  if (!window.MapmyIndia) {
    console.error('MapMyIndia API not loaded');
    return null;
  }
  
  // Check for modern API (MapmyIndia.map.Marker structure)
  if (window.MapmyIndia.map && typeof window.MapmyIndia.map.Marker === 'function') {
    console.log('Using modern MapmyIndia API');
    return 'modern';
  } 
  // Check for legacy API (MapmyIndia.Marker structure)
  else if (typeof window.MapmyIndia.Marker === 'function') {
    console.log('Using legacy MapmyIndia API');
    return 'legacy';
  } 
  // Fallback for when the API is loaded but structure is unexpected
  else {
    console.warn('MapmyIndia API loaded but with unknown structure');
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
    // Set the map instance in the options
    options.map = map;
    
    // Create marker based on API version
    if (apiVersion === 'modern' && window.MapmyIndia.map?.Marker) {
      marker = new window.MapmyIndia.map.Marker(options);
    } else if (apiVersion === 'legacy' && window.MapmyIndia.Marker) {
      marker = new window.MapmyIndia.Marker(options);
    } else {
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
    // Set the map instance in the options
    options.map = map;
    
    // Create polygon based on API version
    if (apiVersion === 'modern' && window.MapmyIndia.map?.Polygon) {
      polygon = new window.MapmyIndia.map.Polygon(options);
    } else if (apiVersion === 'legacy' && window.MapmyIndia.Polygon) {
      polygon = new window.MapmyIndia.Polygon(options);
    } else {
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
    (apiVersion === 'legacy' && !!window.MapmyIndia.Polygon)
  );
};
