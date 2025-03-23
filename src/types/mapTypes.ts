
// Types definition for MapMyIndia
declare global {
  interface Window {
    MapmyIndia: {
      Map: new (element: HTMLElement | string, options: any) => any;
      // Marker, Polygon for both modern and legacy API
      map?: {
        Marker?: new (options: any) => any;
        Polygon?: new (options: any) => any;
      };
      // For legacy API support
      Marker?: new (options: any) => any;
      Polygon?: new (options: any) => any;
      // For Leaflet API support
      L?: {
        marker?: (position: [number, number] | {lat: number, lng: number}, options?: any) => any;
        polygon?: (paths: any[], options?: any) => any;
        map?: new (element: string | HTMLElement, options: any) => any;
        layerGroup?: () => any;
        latLng?: (lat: number, lng: number) => any;
        icon?: (options: any) => any;
        divIcon?: (options: any) => any;
        tileLayer?: (url: string, options?: any) => any;
      };
      // For React SDK
      maplibregl?: any;
      // For mappls V2/V3 API
      mappls?: {
        Map?: new (element: HTMLElement | string, options: any) => any;
        Marker?: new (options: any) => any;
        Polygon?: new (options: any) => any;
      };
    };
    // Maplibre GL JS might be loaded separately
    maplibregl?: any;
    // Standard Leaflet might be loaded instead of MapmyIndia.L
    L?: {
      map: new (element: string | HTMLElement, options: any) => any;
      marker: (position: [number, number] | {lat: number, lng: number}, options?: any) => any;
      tileLayer: (url: string, options?: any) => any;
      polygon: (paths: any[], options?: any) => any;
      icon: (options: any) => any;
      divIcon: (options: any) => any;
    };
  }
}

export interface CrimeData {
  state: string;
  incidents: number;
  resolved: number;
  trend: 'up' | 'down' | 'stable';
  topType: string;
  coordinates?: [number, number]; // [longitude, latitude]
}
