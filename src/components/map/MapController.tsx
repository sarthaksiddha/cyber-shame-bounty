
import React from 'react';
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

  // Get the effective API version to display (from either hook)
  const effectiveApiVersion = apiVersion || markersApiVersion;

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
