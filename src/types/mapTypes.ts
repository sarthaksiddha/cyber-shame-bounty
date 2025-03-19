
// Types definition for MapMyIndia
declare global {
  interface Window {
    MapmyIndia: {
      Map: new (element: HTMLElement, options: any) => any;
      map?: {
        Marker?: new (options: any) => any;
        Polygon?: new (options: any) => any;
      };
      // For legacy API support
      Marker?: new (options: any) => any;
      Polygon?: new (options: any) => any;
      L?: {
        marker?: (position: any, options?: any) => any;
        polygon?: (paths: any, options?: any) => any;
      };
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
