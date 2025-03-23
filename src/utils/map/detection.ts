
/**
 * Utilities for detecting MapMyIndia API version
 */

// Detects which API version we're using
export const detectApiVersion = (): 'modern' | 'legacy' | 'leaflet' | 'mappls' | 'maplibre' | null => {
  if (typeof window === 'undefined' || !window.MapmyIndia) {
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
  // Check for leaflet-based API - most common
  else if (window.MapmyIndia.L) {
    console.log('Using Leaflet-based MapmyIndia API');
    return 'leaflet';
  }
  // Check for legacy API (MapmyIndia.Marker structure)
  else if (typeof window.MapmyIndia.Marker === 'function') {
    console.log('Using legacy MapmyIndia API');
    return 'legacy';
  } 
  
  // Enhanced fallback mechanism with additional checks
  console.log('MapmyIndia API structure not recognized, using enhanced detection');
  
  // Check for any Leaflet-like functionality
  if (window.L || 
      (window.MapmyIndia && typeof window.MapmyIndia.Map === 'function') ||
      (window.MapmyIndia && window.MapmyIndia.map)) {
    console.log('Found Leaflet-like structure, using Leaflet compatibility mode');
    return 'leaflet';
  }
  
  console.warn('MapmyIndia API loaded with unknown structure - using leaflet as fallback');
  return 'leaflet';
};
