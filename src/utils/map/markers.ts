/**
 * Utilities for creating and managing map markers
 */

import { detectApiVersion } from './detection';

// Creates a marker using the appropriate API version
export const createMarker = (
  options: any, 
  map: any
): any => {
  if (!window.MapmyIndia && !window.L) {
    console.error('No mapping API available');
    return null;
  }
  
  const apiVersion = detectApiVersion();
  let marker = null;
  
  try {
    console.log(`Creating marker with API version: ${apiVersion}`);
    
    // Add direct Leaflet fallback when everything else fails
    if (window.L && (!apiVersion || apiVersion === 'leaflet')) {
      // Convert coordinates if needed
      let position = options.position;
      
      // Leaflet expects [lat, lng] instead of [lng, lat]
      if (Array.isArray(position) && position.length === 2) {
        position = [position[1], position[0]];
      }
      
      // Create icon if needed
      let icon = null;
      if (options.icon && window.L.icon) {
        icon = window.L.icon({
          iconUrl: options.icon.url,
          iconSize: [options.icon.size?.width || 25, options.icon.size?.height || 41],
          iconAnchor: [options.icon.anchor?.x || 12, options.icon.anchor?.y || 41]
        });
      }
      
      // Create marker with proper options
      marker = window.L.marker(position, {
        icon: icon,
        draggable: options.draggable
      });
      
      if (marker) {
        marker.addTo(map);
        
        // Add popup if specified
        if (options.popupOptions && options.popupOptions.content) {
          marker.bindPopup(options.popupOptions.content);
        }
        console.log('Created marker with fallback Leaflet API');
        return marker;
      }
    }
    
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
    else if (apiVersion === 'leaflet') {
      // Check for MapmyIndia Leaflet first
      if (window.MapmyIndia.L && window.MapmyIndia.L.marker) {
        // Transform coordinates if needed
        let position = options.position;
        
        // Leaflet often expects [lat, lng] instead of [lng, lat]
        if (Array.isArray(position) && position.length === 2) {
          // Swap if needed
          position = [position[1], position[0]];
        }
        
        // Create icon if needed
        let icon = null;
        if (options.icon && window.MapmyIndia.L.icon) {
          icon = window.MapmyIndia.L.icon({
            iconUrl: options.icon.url,
            iconSize: [options.icon.size?.width || 25, options.icon.size?.height || 41],
            iconAnchor: [options.icon.anchor?.x || 12, options.icon.anchor?.y || 41]
          });
        }
        
        // Create marker with proper options
        marker = window.MapmyIndia.L.marker(position, {
          icon: icon,
          draggable: options.draggable
        });
        
        if (marker) {
          marker.addTo(map);
          
          // Add popup if specified
          if (options.popupOptions && options.popupOptions.content) {
            marker.bindPopup(options.popupOptions.content);
          }
          console.log('Created marker with MapmyIndia Leaflet API');
        }
      } 
      // Check for standard Leaflet
      else if (window.L && window.L.marker) {
        let position = options.position;
        
        // Leaflet expects [lat, lng] instead of [lng, lat]
        if (Array.isArray(position) && position.length === 2) {
          position = [position[1], position[0]];
        }
        
        // Create icon if needed
        let icon = null;
        if (options.icon && window.L.icon) {
          icon = window.L.icon({
            iconUrl: options.icon.url,
            iconSize: [options.icon.size?.width || 25, options.icon.size?.height || 41],
            iconAnchor: [options.icon.anchor?.x || 12, options.icon.anchor?.y || 41]
          });
        }
        
        // Create marker with proper options
        marker = window.L.marker(position, {
          icon: icon,
          draggable: options.draggable
        });
        
        if (marker) {
          marker.addTo(map);
          
          // Add popup if specified
          if (options.popupOptions && options.popupOptions.content) {
            marker.bindPopup(options.popupOptions.content);
          }
          console.log('Created marker with standard Leaflet API');
        }
      }
      else if (window.MapmyIndia.L && window.MapmyIndia.L.layerGroup) {
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
    console.error('Error creating marker, trying standard Leaflet fallback:', error);
    
    // Final fallback - direct Leaflet
    if (window.L) {
      try {
        const position = Array.isArray(options.position) ? 
          [options.position[1], options.position[0]] : options.position;
          
        const marker = window.L.marker(position);
        marker.addTo(map);
        
        if (options.popupOptions && options.popupOptions.content) {
          marker.bindPopup(options.popupOptions.content);
        }
        
        console.log('Created marker with emergency Leaflet fallback');
        return marker;
      } catch (e) {
        console.error('Final fallback also failed:', e);
      }
    }
  }
  
  return marker;
};
