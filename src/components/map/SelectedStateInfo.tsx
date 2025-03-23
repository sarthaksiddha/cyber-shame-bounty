
import React from 'react';
import { CrimeData } from '@/types/mapTypes';
import { formatNumber } from '@/utils/mapUtils';

interface SelectedStateInfoProps {
  selectedState: CrimeData | null;
}

const SelectedStateInfo: React.FC<SelectedStateInfoProps> = ({ selectedState }) => {
  if (!selectedState) return null;
  
  return (
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
  );
};

export default SelectedStateInfo;
