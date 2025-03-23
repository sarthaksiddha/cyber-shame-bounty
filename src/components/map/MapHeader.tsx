
import React from 'react';
import { Undo } from 'lucide-react';
import { Button } from '../ui/button';

interface MapHeaderProps {
  apiVersion: string | null;
  handleResetMap: () => void;
}

const MapHeader: React.FC<MapHeaderProps> = ({ apiVersion, handleResetMap }) => {
  return (
    <>
      <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded p-2 z-10">
        <p className="text-xs font-mono">MapMyIndia Interactive Map</p>
        <p className="text-xs font-mono opacity-50">API: {apiVersion || 'detecting...'}</p>
      </div>
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 dark:bg-black/80 backdrop-blur-sm"
          onClick={handleResetMap}
        >
          <Undo className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default MapHeader;
