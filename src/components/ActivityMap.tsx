import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, TrendingUp, Check, ZoomIn, ZoomOut, Undo } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Button } from './ui/button';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedState, setSelectedState] = useState<CrimeData | null>(null);
  const [sortBy, setSortBy] = useState<'incidents' | 'resolved'>('incidents');
  const [mapVisible, setMapVisible] = useState(false);
  const [mapView, setMapView] = useState<'heatmap' | 'bubble'>('heatmap');
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const sortedStateData = [...stateData].sort((a, b) => b[sortBy] - a[sortBy]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.unobserve(entry.target);
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

  useEffect(() => {
    if (!mapVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mapCoordinatesToCanvas = (lon: number, lat: number) => {
      const minLon = 68;
      const maxLon = 97;
      const minLat = 8;
      const maxLat = 37;

      const x = ((lon - minLon) / (maxLon - minLon)) * canvas.width * zoomLevel;
      const y = canvas.height - ((lat - minLat) / (maxLat - minLat)) * canvas.height * zoomLevel;
      
      const offsetX = canvas.width * (1 - zoomLevel) / 2;
      const offsetY = canvas.height * (1 - zoomLevel) / 2;
      
      return { 
        x: x + offsetX, 
        y: y + offsetY 
      };
    };

    ctx.beginPath();
    indiaOutline.forEach((coord, index) => {
      const { x, y } = mapCoordinatesToCanvas(coord[0], coord[1]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (mapView === 'heatmap') {
      stateData.forEach(state => {
        if (!state.coordinates) return;
        
        const { x, y } = mapCoordinatesToCanvas(state.coordinates[0], state.coordinates[1]);
        
        const radius = Math.sqrt(state.incidents) / 15;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, radius * 30);
        
        const intensity = Math.min(state.incidents / 5000, 1);
        grd.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.7})`);
        grd.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, radius * 30, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (mapView === 'bubble') {
      stateData.forEach(state => {
        if (!state.coordinates) return;
        
        const { x, y } = mapCoordinatesToCanvas(state.coordinates[0], state.coordinates[1]);
        const radius = Math.sqrt(state.incidents) / 10;
        
        const resolutionRate = state.resolved / state.incidents;
        const r = Math.floor(255 * (1 - resolutionRate));
        const g = Math.floor(255 * resolutionRate);
        const b = 100;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(state.state, x, y + radius + 12);
        
        if (selectedState && state.state === selectedState.state) {
          ctx.beginPath();
          ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }
  }, [mapVisible, selectedState, mapView, zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1.0);
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

        <div ref={mapRef} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
          
          <div className="lg:col-span-3 futuristic-card !p-0 relative overflow-hidden">
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 bg-gradient-to-br from-black/5 to-primary/5 dark:from-black/30 dark:to-primary/10 ${mapVisible ? 'opacity-100' : 'opacity-0'}`}>
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={(e) => {
                  if (!canvasRef.current) return;
                  
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  let closestState = null;
                  let minDistance = Infinity;
                  
                  stateData.forEach(state => {
                    if (!state.coordinates) return;
                    
                    const minLon = 68;
                    const maxLon = 97;
                    const minLat = 8;
                    const maxLat = 37;
                    
                    const canvasWidth = canvasRef.current!.width;
                    const canvasHeight = canvasRef.current!.height;
                    
                    const pointX = ((state.coordinates[0] - minLon) / (maxLon - minLon)) * canvasWidth * zoomLevel;
                    const pointY = canvasHeight - ((state.coordinates[1] - minLat) / (maxLat - minLat)) * canvasHeight * zoomLevel;
                    
                    const offsetX = canvasWidth * (1 - zoomLevel) / 2;
                    const offsetY = canvasHeight * (1 - zoomLevel) / 2;
                    
                    const adjustedX = pointX + offsetX;
                    const adjustedY = pointY + offsetY;
                    
                    const distance = Math.sqrt(Math.pow(x - adjustedX, 2) + Math.pow(y - adjustedY, 2));
                    
                    if (distance < minDistance) {
                      minDistance = distance;
                      closestState = state;
                    }
                  });
                  
                  const clickRadius = 30 * (1 / zoomLevel);
                  if (minDistance < clickRadius && closestState) {
                    setSelectedState(closestState);
                  }
                }}
              />
              
              <div className="absolute top-4 left-4 text-sm font-mono text-white/70 dark:text-white/80 bg-black/20 dark:bg-black/40 px-2 py-1 rounded">
                Interactive India Map
              </div>
              
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomIn}
                  className="bg-black/20 dark:bg-black/40 border-0 text-white/80 hover:bg-black/30 hover:text-white"
                >
                  <ZoomIn size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomOut}
                  className="bg-black/20 dark:bg-black/40 border-0 text-white/80 hover:bg-black/30 hover:text-white"
                >
                  <ZoomOut size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleResetZoom}
                  className="bg-black/20 dark:bg-black/40 border-0 text-white/80 hover:bg-black/30 hover:text-white"
                >
                  <Undo size={18} />
                </Button>
              </div>
              
              {selectedState ? (
                <div className="absolute bottom-4 right-4 futuristic-card !p-4 max-w-xs w-full mx-auto animate-fade-in">
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
              ) : (
                <p className="italic text-sm absolute bottom-4 right-4 font-mono bg-black/20 dark:bg-black/40 px-3 py-1 rounded text-white/70 dark:text-white/80">
                  Click on a state to view statistics
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2 font-mono text-xs">Data based on reported incidents from April 2022 to March 2023</p>
          <p className="text-sm">Source: Ministry of Home Affairs, Indian Cyber Crime Coordination Centre (I4C)</p>
        </div>
      </div>
    </section>
  );
};

export default ActivityMap;
