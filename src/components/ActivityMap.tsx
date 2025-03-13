
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, TrendingUp, Check } from 'lucide-react';

interface CrimeData {
  state: string;
  incidents: number;
  resolved: number;
  trend: 'up' | 'down' | 'stable';
  topType: string;
}

const stateData: CrimeData[] = [
  { state: 'Maharashtra', incidents: 5429, resolved: 2817, trend: 'up', topType: 'Financial Fraud' },
  { state: 'Delhi', incidents: 4231, resolved: 1782, trend: 'up', topType: 'Social Media Scams' },
  { state: 'Karnataka', incidents: 3756, resolved: 2103, trend: 'up', topType: 'Ransomware' },
  { state: 'Tamil Nadu', incidents: 2901, resolved: 1450, trend: 'stable', topType: 'Banking Fraud' },
  { state: 'Telangana', incidents: 2698, resolved: 1349, trend: 'up', topType: 'Phishing' },
  { state: 'Gujarat', incidents: 2541, resolved: 1524, trend: 'stable', topType: 'OTP Fraud' },
  { state: 'Uttar Pradesh', incidents: 2301, resolved: 920, trend: 'up', topType: 'UPI Scams' },
  { state: 'Rajasthan', incidents: 1876, resolved: 750, trend: 'stable', topType: 'OTP Fraud' },
  { state: 'West Bengal', incidents: 1754, resolved: 842, trend: 'down', topType: 'Banking Fraud' },
  { state: 'Kerala', incidents: 1624, resolved: 973, trend: 'down', topType: 'Job Scams' },
  { state: 'Punjab', incidents: 1320, resolved: 726, trend: 'stable', topType: 'Social Media Scams' },
  { state: 'Haryana', incidents: 1289, resolved: 644, trend: 'up', topType: 'Financial Fraud' },
  { state: 'Bihar', incidents: 1203, resolved: 482, trend: 'up', topType: 'UPI Scams' },
  { state: 'Madhya Pradesh', incidents: 1187, resolved: 593, trend: 'stable', topType: 'OTP Fraud' },
  { state: 'Andhra Pradesh', incidents: 1089, resolved: 598, trend: 'down', topType: 'Banking Fraud' },
  { state: 'Odisha', incidents: 890, resolved: 401, trend: 'stable', topType: 'Financial Fraud' },
  { state: 'Assam', incidents: 768, resolved: 307, trend: 'up', topType: 'UPI Scams' },
  { state: 'Jharkhand', incidents: 682, resolved: 341, trend: 'stable', topType: 'Phishing' },
  { state: 'Uttarakhand', incidents: 578, resolved: 289, trend: 'stable', topType: 'Job Scams' },
  { state: 'Himachal Pradesh', incidents: 423, resolved: 254, trend: 'down', topType: 'OTP Fraud' },
  { state: 'Goa', incidents: 321, resolved: 192, trend: 'down', topType: 'Social Media Scams' },
  { state: 'Tripura', incidents: 289, resolved: 144, trend: 'stable', topType: 'UPI Scams' },
  { state: 'Manipur', incidents: 192, resolved: 96, trend: 'stable', topType: 'Phishing' },
  { state: 'Meghalaya', incidents: 167, resolved: 83, trend: 'stable', topType: 'Financial Fraud' },
  { state: 'Nagaland', incidents: 143, resolved: 71, trend: 'stable', topType: 'Job Scams' },
  { state: 'Arunachal Pradesh', incidents: 128, resolved: 64, trend: 'stable', topType: 'UPI Scams' },
  { state: 'Mizoram', incidents: 112, resolved: 56, trend: 'down', topType: 'Banking Fraud' },
  { state: 'Sikkim', incidents: 98, resolved: 59, trend: 'down', topType: 'Financial Fraud' },
];

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ActivityMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState<CrimeData | null>(null);
  const [sortBy, setSortBy] = useState<'incidents' | 'resolved'>('incidents');
  const [mapVisible, setMapVisible] = useState(false);

  // Sort data based on current sort criteria
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

  // Calculate totals for summary stats
  const totalIncidents = stateData.reduce((sum, state) => sum + state.incidents, 0);
  const totalResolved = stateData.reduce((sum, state) => sum + state.resolved, 0);
  const resolvedPercentage = Math.round((totalResolved / totalIncidents) * 100);

  return (
    <section id="activity-map" className="py-24 px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-orange-100 text-orange-600 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Geographic Data</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Cyber Crime Activity Map</h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Track reported cyber crime incidents across India to identify hotspots and trends.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="glass-card p-4">
              <p className="text-sm text-gray-500 mb-1">Total Reported</p>
              <p className="text-3xl font-bold text-primary">{formatNumber(totalIncidents)}</p>
              <div className="flex items-center justify-center mt-1">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm">Cyber crime incidents</span>
              </div>
            </div>
            
            <div className="glass-card p-4">
              <p className="text-sm text-gray-500 mb-1">Cases Resolved</p>
              <p className="text-3xl font-bold text-green-600">{formatNumber(totalResolved)}</p>
              <div className="flex items-center justify-center mt-1">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm">Successfully resolved</span>
              </div>
            </div>
            
            <div className="glass-card p-4">
              <p className="text-sm text-gray-500 mb-1">Resolution Rate</p>
              <p className="text-3xl font-bold text-blue-600">{resolvedPercentage}%</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm">National average</span>
              </div>
            </div>
          </div>
        </div>

        <div ref={mapRef} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 glass-card p-6 h-[500px] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">States Ranking</h3>
              <div className="inline-flex p-0.5 rounded-md bg-gray-100 text-xs">
                <button
                  onClick={() => setSortBy('incidents')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    sortBy === 'incidents' 
                      ? 'bg-white shadow-sm font-medium' 
                      : 'text-gray-600'
                  }`}
                >
                  By Cases
                </button>
                <button
                  onClick={() => setSortBy('resolved')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    sortBy === 'resolved' 
                      ? 'bg-white shadow-sm font-medium' 
                      : 'text-gray-600'
                  }`}
                >
                  By Resolved
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
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-5 text-sm text-gray-400">{index + 1}</span>
                      <span className="font-medium">{state.state}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-sm">
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
          
          <div className="lg:col-span-3 glass-card p-6 relative overflow-hidden">
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${mapVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="relative w-full h-full">
                {/* This is a placeholder for where an actual India map SVG would go */}
                <div className="p-4 text-center absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-gray-500 mb-4">
                    Interactive India map would be displayed here, showing heatmap of cyber crime incidents
                  </p>
                  
                  {selectedState ? (
                    <div className="glass-card p-4 max-w-xs w-full mx-auto">
                      <h3 className="font-semibold text-lg">{selectedState.state}</h3>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Reported</p>
                          <p className="font-bold text-red-600">{formatNumber(selectedState.incidents)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Resolved</p>
                          <p className="font-bold text-green-600">{formatNumber(selectedState.resolved)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Resolution Rate</p>
                          <p className="font-bold">
                            {Math.round((selectedState.resolved / selectedState.incidents) * 100)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Top Scam</p>
                          <p className="font-bold">{selectedState.topType}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="italic text-sm">Select a state to view detailed statistics</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Data based on reported incidents from April 2022 to March 2023</p>
          <p className="text-sm">Source: Ministry of Home Affairs, Indian Cyber Crime Coordination Centre (I4C)</p>
        </div>
      </div>
    </section>
  );
};

export default ActivityMap;
