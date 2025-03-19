
// Types definition for MapMyIndia
declare global {
  interface Window {
    MapmyIndia: {
      Map: new (element: HTMLElement, options: any) => any;
      // Using proper MapmyIndia map marker API structure
      map: {
        Marker: new (options: any) => any;
        Polygon?: new (options: any) => any; // Make Polygon optional
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
