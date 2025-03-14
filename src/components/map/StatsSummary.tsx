
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Check, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/utils/mapUtils';

const StatsSummary: React.FC = () => {
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [totalResolved, setTotalResolved] = useState(0);
  const [resolvedPercentage, setResolvedPercentage] = useState(0);

  useEffect(() => {
    // Dynamically import the data to avoid circular dependencies
    import('@/data/crimeMapData').then(({ stateData }) => {
      const incidents = stateData.reduce((sum, state) => sum + state.incidents, 0);
      const resolved = stateData.reduce((sum, state) => sum + state.resolved, 0);
      const percentage = Math.round((resolved / incidents) * 100);
      
      setTotalIncidents(incidents);
      setTotalResolved(resolved);
      setResolvedPercentage(percentage);
    });
  }, []);

  return (
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
  );
};

export default StatsSummary;
