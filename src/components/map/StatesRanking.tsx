
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { CrimeData } from '@/types/mapTypes';
import { formatNumber } from '@/utils/mapUtils';

interface StatesRankingProps {
  selectedState: CrimeData | null;
  setSelectedState: (state: CrimeData) => void;
  sortBy: 'incidents' | 'resolved';
  setSortBy: (sortBy: 'incidents' | 'resolved') => void;
}

const StatesRanking: React.FC<StatesRankingProps> = ({ 
  selectedState, 
  setSelectedState, 
  sortBy, 
  setSortBy 
}) => {
  const [sortedStateData, setSortedStateData] = React.useState<CrimeData[]>([]);

  React.useEffect(() => {
    // Dynamically import the data to avoid circular dependencies
    import('@/data/crimeMapData').then(({ stateData }) => {
      const sorted = [...stateData].sort((a, b) => b[sortBy] - a[sortBy]);
      setSortedStateData(sorted);
    });
  }, [sortBy]);

  return (
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
  );
};

export default StatesRanking;
