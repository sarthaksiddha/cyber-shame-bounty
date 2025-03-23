
/**
 * Utilities for creating and managing map polygons
 */

import { detectApiVersion } from './detection';

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
        // For Leaflet, paths might need to be reversed [lat, lng] instead of [lng, lat]
        const reversedPaths = options.paths[0].map((point: [number, number]) => [point[1], point[0]]);
        
        polygon = window.MapmyIndia.L.polygon(reversedPaths, {
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
