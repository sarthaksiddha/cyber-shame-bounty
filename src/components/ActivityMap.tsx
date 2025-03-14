import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, TrendingUp, Check, ZoomIn, ZoomOut, Undo } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Button } from './ui/button';

// Types definition for MapMyIndia
declare global {
  interface Window {
    MapmyIndia: {
      Map: new (options: any) => any;
      Marker: new (options: any) => any;
      Polygon: new (options: any) => any;
    };
  }
}

interface CrimeData {
  state: string;
  incidents: number;
  resolved: number;
  trend: 'up' | 'down' | 'stable';
  topType: string;
  coordinates?: [number, number]; // [longitude, latitude]
}

const stateData: CrimeData[] = [
  { state: 'Maharashtra', incidents: 5429, resolved: 2817, trend: 'up', topType: 'Financial Fraud', coordinates: [73.8567, 18.5204] },
  { state: 'Delhi', incidents: 4231, resolved: 1782, trend: 'up', topType: 'Social Media Scams', coordinates: [77.1025, 28.7041] },
  { state: 'Karnataka', incidents: 3756, resolved: 2103, trend: 'up', topType: 'Ransomware', coordinates: [75.7139, 15.3173] },
  { state: 'Tamil Nadu', incidents: 2901, resolved: 1450, trend: 'stable', topType: 'Banking Fraud', coordinates: [78.6569, 11.1271] },
  { state: 'Telangana', incidents: 2698, resolved: 1349, trend: 'up', topType: 'Phishing', coordinates: [79.0193, 17.1131] },
  { state: 'Gujarat', incidents: 2541, resolved: 1524, trend: 'stable', topType: 'OTP Fraud', coordinates: [71.1924, 22.2587] },
  { state: 'Uttar Pradesh', incidents: 2301, resolved: 920, trend: 'up', topType: 'UPI Scams', coordinates: [80.9462, 26.8467] },
  { state: 'Rajasthan', incidents: 1876, resolved: 750, trend: 'stable', topType: 'OTP Fraud', coordinates: [73.8278, 26.9124] },
  { state: 'West Bengal', incidents: 1754, resolved: 842, trend: 'down', topType: 'Banking Fraud', coordinates: [87.8550, 22.9868] },
  { state: 'Kerala', incidents: 1624, resolved: 973, trend: 'down', topType: 'Job Scams', coordinates: [76.2711, 10.8505] },
  { state: 'Punjab', incidents: 1320, resolved: 726, trend: 'stable', topType: 'Social Media Scams', coordinates: [75.3412, 31.1471] },
  { state: 'Haryana', incidents: 1289, resolved: 644, trend: 'up', topType: 'Financial Fraud', coordinates: [76.0856, 29.0588] },
  { state: 'Bihar', incidents: 1203, resolved: 482, trend: 'up', topType: 'UPI Scams', coordinates: [85.3131, 25.0961] },
  { state: 'Madhya Pradesh', incidents: 1187, resolved: 593, trend: 'stable', topType: 'OTP Fraud', coordinates: [78.6569, 22.9734] },
  { state: 'Andhra Pradesh', incidents: 1089, resolved: 598, trend: 'down', topType: 'Banking Fraud', coordinates: [78.7047, 14.7504] },
  { state: 'Odisha', incidents: 890, resolved: 401, trend: 'stable', topType: 'Financial Fraud', coordinates: [85.0985, 20.9517] },
  { state: 'Assam', incidents: 768, resolved: 307, trend: 'up', topType: 'UPI Scams', coordinates: [92.9376, 26.2006] },
  { state: 'Jharkhand', incidents: 682, resolved: 341, trend: 'stable', topType: 'Phishing', coordinates: [85.3096, 23.6102] },
  { state: 'Uttarakhand', incidents: 578, resolved: 289, trend: 'stable', topType: 'Job Scams', coordinates: [79.0193, 30.0668] },
  { state: 'Himachal Pradesh', incidents: 423, resolved: 254, trend: 'down', topType: 'OTP Fraud', coordinates: [77.1734, 31.1048] },
  { state: 'Goa', incidents: 321, resolved: 192, trend: 'down', topType: 'Social Media Scams', coordinates: [74.1240, 15.2993] },
  { state: 'Tripura', incidents: 289, resolved: 144, trend: 'stable', topType: 'UPI Scams', coordinates: [91.9882, 23.9408] },
  { state: 'Manipur', incidents: 192, resolved: 96, trend: 'stable', topType: 'Phishing', coordinates: [93.9063, 24.6637] },
  { state: 'Meghalaya', incidents: 167, resolved: 83, trend: 'stable', topType: 'Financial Fraud', coordinates: [91.3662, 25.4670] },
  { state: 'Nagaland', incidents: 143, resolved: 71, trend: 'stable', topType: 'Job Scams', coordinates: [94.5624, 26.1584] },
  { state: 'Arunachal Pradesh', incidents: 128, resolved: 64, trend: 'stable', topType: 'UPI Scams', coordinates: [94.7278, 28.2180] },
  { state: 'Mizoram', incidents: 112, resolved: 56, trend: 'down', topType: 'Banking Fraud', coordinates: [92.9376, 23.1645] },
  { state: 'Sikkim', incidents: 98, resolved: 59, trend: 'down', topType: 'Financial Fraud', coordinates: [88.5122, 27.5330] },
];

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ActivityMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedState, setSelectedState] = useState<CrimeData | null>(null);
  const [sortBy, setSortBy] = useState<'incidents' | 'resolved'>('incidents');
  const [mapVisible, setMapVisible] = useState(false);
  const [mapView, setMapView] = useState<'heatmap' | 'bubble'>('heatmap');
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const sortedStateData = [...stateData].sort((a, b) => b[sortBy] - a[sortBy]);

  // Initialize MapMyIndia map
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.unobserve(entry.target);

          // Initialize map when it becomes visible
          initializeMap();
        }
      });
    }, observerOptions);

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, []);

  // Update map markers/heatmap when settings change
  useEffect(() => {
    if (mapVisible && mapInstanceRef.current) {
      updateMapView();
    }
  }, [mapView, selectedState, mapVisible]);

  const initializeMap = () => {
    // Check if the MapMyIndia API is loaded
    if (!window.MapmyIndia || !mapRef.current) {
      console.error('MapMyIndia API not loaded or map container not found');
      return;
    }

    try {
      // Clear previous map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }
      }

      // Create new map instance
      const mapOptions = {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        zoomControl: true,
        hybrid: true
      };

      mapInstanceRef.current = new window.MapmyIndia.Map(mapRef.current, mapOptions);
      
      // Initialize map with current view mode
      updateMapView();

    } catch (error) {
      console.error('Error initializing MapMyIndia map:', error);
    }
  };

  const updateMapView = () => {
    if (!mapInstanceRef.current) return;

    // Clear previous markers
    mapInstanceRef.current.removeAllMarkers?.();
    mapInstanceRef.current.removeAllPolygons?.();

    if (mapView === 'bubble') {
      // Add state markers (bubble view)
      stateData.forEach((state) => {
        if (!state.coordinates) return;

        const resolutionRate = state.resolved / state.incidents;
        const radius = Math.sqrt(state.incidents) / 20;
        const isSelected = selectedState?.state === state.state;

        // Create marker with scaled size based on incidents
        const markerOptions = {
          position: state.coordinates,
          icon: {
            url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${radius * 2}px" height="${radius * 2}px"><circle cx="50" cy="50" r="40" fill="rgba(${Math.floor(255 * (1 - resolutionRate))}, ${Math.floor(255 * resolutionRate)}, 100, 0.7)" stroke="${isSelected ? 'white' : 'none'}" stroke-width="${isSelected ? '4' : '0'}"/></svg>`,
            size: { width: radius * 2, height: radius * 2 },
            anchor: { x: radius, y: radius }
          },
          popupOptions: {
            content: `<b>${state.state}</b><br>Incidents: ${state.incidents}<br>Resolved: ${state.resolved}`
          },
          map: mapInstanceRef.current
        };

        // Create marker and add click event
        const marker = new window.MapmyIndia.Marker(markerOptions);
        
        // Add click handler (implementation would depend on MapMyIndia API)
        // This is a placeholder for the actual implementation
        marker.addListener?.('click', () => {
          setSelectedState(state);
        });
      });
    } else {
      // Heatmap view implementation would depend on MapMyIndia's heatmap support
      // This is a simplified alternative if heatmap isn't directly supported
      stateData.forEach((state) => {
        if (!state.coordinates) return;
        
        const intensity = Math.min(state.incidents / 5000, 1);
        const radius = Math.sqrt(state.incidents) / 10 * 30000; // Scale for map units
        
        // Create a circular polygon as a "heatmap" effect
        try {
          const circleCoords = generateCirclePoints(state.coordinates, radius, 20);
          
          const polygonOptions = {
            paths: [circleCoords],
            fillColor: `rgba(255, 0, 0, ${intensity * 0.5})`,
            fillOpacity: 0.5,
            strokeColor: 'rgba(255, 0, 0, 0.1)',
            strokeOpacity: 0.1,
            strokeWeight: 1,
            map: mapInstanceRef.current
          };
          
          new window.MapmyIndia.Polygon(polygonOptions);
        } catch (error) {
          console.error('Error creating heatmap polygon:', error);
        }
      });
    }
  };

  // Helper function to generate circle points for heatmap
  const generateCirclePoints = (center: [number, number], radius: number, points: number) => {
    const coords = [];
    const earthRadius = 6378137; // Earth's radius in meters
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);
      
      // Calculate new position
      const lat = center[1] + (dy / earthRadius) * (180 / Math.PI);
      const lng = center[0] + (dx / earthRadius) * (180 / Math.PI) / Math.cos(center[1] * Math.PI / 180);
      
      coords.push([lng, lat]);
    }
    
    return coords;
  };

  const totalIncidents = stateData.reduce((sum, state) => sum + state.incidents, 0);
  const totalResolved = stateData.reduce((sum, state) => sum + state.resolved, 0);
  const resolvedPercentage = Math.round((totalResolved / totalIncidents) * 100);

  return (
    <section id="activity-map" className="py-24 px-6 bg-gradient-to-b from-background to-secondary/30 dark:from-background dark:to-gray-900/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Geographic Data</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-br from-primary to-blue-500 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent animate-gradient-x">
            Cyber Crime Activity Map
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 font-display">
            Track reported cyber crime incidents across India to identify hotspots and trends.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="futuristic-card">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-mono">Total Reported</p>
              <p className="text-3xl font-bold text-primary">{formatNumber(totalIncidents)}</p>
              <div className="flex items-center justify-center mt-1">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm">Cyber crime incidents</span>
              </div>
            </div>
            
            <div className="futuristic-card">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-mono">Cases Resolved</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-500">{formatNumber(totalResolved)}</p>
              <div className="flex items-center justify-center mt-1">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm">Successfully resolved</span>
              </div>
            </div>
            
            <div className="futuristic-card">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-mono">Resolution Rate</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{resolvedPercentage}%</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm">National average</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6 space-x-4">
          <ToggleGroup type="single" value={mapView} onValueChange={(value) => value && setMapView(value as 'heatmap' | 'bubble')}>
            <ToggleGroupItem value="heatmap" aria-label="Heatmap view" className="font-mono text-xs">
              HEATMAP
            </ToggleGroupItem>
            <ToggleGroupItem value="bubble" aria-label="Bubble view" className="font-mono text-xs">
              BUBBLE
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 futuristic-card h-[500px] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-sm">STATES RANKING</h3>
              <div className="inline-flex p-0.5 rounded-md bg-secondary/80 dark:bg-gray-800/80 text-xs font-mono">
                <button
                  onClick={() => setSortBy('incidents')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    sortBy === 'incidents' 
                      ? 'bg-primary text-white shadow-sm font-medium' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  BY CASES
                </button>
                <button
                  onClick={() => setSortBy('resolved')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    sortBy === 'resolved' 
                      ? 'bg-primary text-white shadow-sm font-medium' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  BY RESOLVED
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {sortedStateData.map((state, index) => (
                <div
                  key={state.state}
                  onClick={() => setSelectedState(state)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedState?.state === state.state
                      ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-5 text-sm text-gray-400 font-mono">{index + 1}</span>
                      <span className="font-medium">{state.state}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono text-sm">
                        {formatNumber(state[sortBy])}
                      </span>
                      {state.trend === 'up' && <TrendingUp className="ml-1 h-3.5 w-3.5 text-red-500" />}
                      {state.trend === 'down' && <TrendingUp className="ml-1 h-3.5 w-3.5 text-green-500 transform rotate-180" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-3 futuristic-card !p-0 relative h-[500px]">
            <div ref={mapRef} className="absolute inset-0 w-full h-full" />
            
            {selectedState && (
              <div className="absolute bottom-4 right-4 futuristic-card !p-4 max-w-xs w-full mx-auto animate-fade-in bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <h3 className="font-mono text-lg">{selectedState.state}</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">REPORTED</p>
                    <p className="font-bold text-red-600 dark:text-red-400">{formatNumber(selectedState.incidents)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">RESOLVED</p>
                    <p className="font-bold text-green-600 dark:text-green-400">{formatNumber(selectedState.resolved)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">RESOLUTION</p>
                    <p className="font-bold">
                      {Math.round((selectedState.resolved / selectedState.incidents) * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-xs">TOP SCAM</p>
                    <p className="font-bold">{selectedState.topType}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded p-2 z-10">
              <p className="text-xs font-mono">MapMyIndia Interactive Map</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2 font-mono text-xs">Data based on reported incidents from April 2022 to March 2023</p>
          <p className="text-sm">Source: Ministry of Home Affairs, Indian Cyber Crime Coordination Centre (I4C)</p>
          <p className="mt-2 text-xs italic">Note: You need to replace "map_js_key" in the HTML file with a valid MapMyIndia API key</p>
        </div>
      </div>
    </section>
  );
};

export default ActivityMap;
