
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
        marker?: (position: any, options?: any) => any;
        polygon?: (paths: any, options?: any) => any;
        map?: new (element: string | HTMLElement, options: any) => any;
        layerGroup?: () => any;
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
