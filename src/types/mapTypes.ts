
// Types definition for MapMyIndia
declare global {
  interface Window {
    MapmyIndia: {
      Map: new (element: HTMLElement, options: any) => any;
      Marker: new (options: any) => any;
      Polygon?: new (options: any) => any; // Make Polygon optional since it might not be available
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
