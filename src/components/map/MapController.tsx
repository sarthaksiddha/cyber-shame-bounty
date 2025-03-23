import React, { useEffect } from 'react';
import { CrimeData } from '@/types/mapTypes';
import { useMapInstance } from '@/hooks/useMapInstance';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import MapLoadingState from './MapLoadingState';
import SelectedStateInfo from './SelectedStateInfo';
import MapHeader from './MapHeader';

interface MapControllerProps {
  selectedState: CrimeData | null;
  setSelectedState: (state: CrimeData) => void;
  mapView: 'heatmap' | 'bubble';
}

const MapController: React.FC<MapControllerProps> = ({ 
  selectedState, 
  setSelectedState,
  mapView 
}) => {
  // Use our custom hooks to manage the map
  const {
    mapRef,
    mapInstanceRef,
    mapInitialized,
    mapError,
    isLoading,
    apiVersion,
    handleResetMap,
    setIsLoading
  } = useMapInstance();
  
  // Use our markers hook to manage map objects
  const {
    markersCreated,
    apiVersion: markersApiVersion,
    updateMapView
  } = useMapMarkers(
    mapInstanceRef,
    mapInitialized,
    setIsLoading,
    selectedState,
    setSelectedState,
    mapView
  );

const attemptMapRecovery = useCallback(() => {
  console.log('Attempting map recovery...');
  setIsLoading(true);
  
  // Try to load standard Leaflet dynamically
  const loadLeaflet = async () => {
    if (!window.L) {
      try {
        const L = await import('leaflet');
        // Attach to window for global access
        window.L = L;
        console.log('Dynamically loaded Leaflet for recovery');
        handleResetMap();
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        setMapError('Could not load map libraries. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    } else {
      handleResetMap();
    }
  };
  
  loadLeaflet();
}, [handleResetMap, setIsLoading]);

// Add this to your MapLoadingState component props
<MapLoadingState 
  isLoading={isLoading}
  mapError={mapError}
  markersCreated={markersCreated}
  mapInitialized={mapInitialized}
  handleResetMap={handleResetMap}
  attemptMapRecovery={attemptMapRecovery}
/>
  // Get the effective API version to display (from either hook)
  const effectiveApiVersion = apiVersion || markersApiVersion;
  
  // Update the map whenever initialization status changes
  useEffect(() => {
    if (mapInitialized && mapInstanceRef.current) {
      // Add a short delay to ensure map is fully initialized
      const timer = setTimeout(() => {
        updateMapView();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [mapInitialized, mapView]);

  return (
    <div className="lg:col-span-3 futuristic-card !p-0 relative h-[500px]">
      <div 
        ref={mapRef} 
        className="absolute inset-0 w-full h-full rounded-lg overflow-hidden z-10" 
        id="map-container"
        style={{ background: '#f8f9fa' }}
        data-testid="map-element"
      />
      
      {/* Loading and error states */}
      <MapLoadingState 
        isLoading={isLoading}
        mapError={mapError}
        markersCreated={markersCreated}
        mapInitialized={mapInitialized}
        handleResetMap={handleResetMap}
      />
      
      {/* Map header and controls */}
      <MapHeader 
        apiVersion={effectiveApiVersion} 
        handleResetMap={handleResetMap} 
      />
      
      {/* Selected state information */}
      <SelectedStateInfo selectedState={selectedState} />
    </div>
  );
};

export default MapController;
