
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

interface FilterTabsProps {
  activeTab: 'all' | 'active' | 'busted';
  setActiveTab: (tab: 'all' | 'active' | 'busted') => void;
}

const FilterTabs = ({ activeTab, setActiveTab }: FilterTabsProps) => {
  return (
    <div className="mb-10 flex justify-center">
      <div className="inline-flex p-1 rounded-full bg-gray-100">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'all' 
              ? 'bg-white shadow-sm text-gray-900' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Scammers
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            activeTab === 'active' 
              ? 'bg-white shadow-sm text-gray-900' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Still Active</span>
        </button>
        <button
          onClick={() => setActiveTab('busted')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            activeTab === 'busted' 
              ? 'bg-white shadow-sm text-gray-900' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          <span>Busted</span>
        </button>
      </div>
    </div>
  );
};

export default FilterTabs;
