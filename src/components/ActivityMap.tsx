
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { toast } from './ui/use-toast';
import { CrimeData } from '@/types/mapTypes';
import StatsSummary from './map/StatsSummary';
import StatesRanking from './map/StatesRanking';
import MapController from './map/MapController';

const ActivityMap = () => {
  const [selectedState, setSelectedState] = useState<CrimeData | null>(null);
  const [sortBy, setSortBy] = useState<'incidents' | 'resolved'>('incidents');
  const [mapView, setMapView] = useState<'heatmap' | 'bubble'>('heatmap');

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

          <StatsSummary />
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
          <StatesRanking 
            selectedState={selectedState} 
            setSelectedState={setSelectedState} 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
          />
          
          <MapController 
            selectedState={selectedState} 
            setSelectedState={setSelectedState} 
            mapView={mapView} 
          />
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
