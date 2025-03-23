
import React from 'react';
import { AlertTriangle, Undo } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface MapLoadingStateProps {
  isLoading: boolean;
  mapError: string | null;
  markersCreated: number;
  mapInitialized: boolean;
  handleResetMap: () => void;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({
  isLoading,
  mapError,
  markersCreated,
  mapInitialized,
  handleResetMap
}) => {
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-lg">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-400 mb-4">{mapError}</p>
            <Button onClick={handleResetMap}>Reload Map</Button>
          </div>
        </div>
      )}
      
      {!isLoading && mapInitialized && markersCreated === 0 && (
        <div className="absolute top-16 left-4 right-4 z-10">
          <Alert variant="destructive" className="bg-white/90 dark:bg-gray-900/90 border-red-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Map API Compatibility Issue</AlertTitle>
            <AlertDescription>
              Failed to display map markers. The API might be incompatible with this browser.
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleResetMap}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default MapLoadingState;
