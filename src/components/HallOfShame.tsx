
import React, { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import { scammers } from '../data/scammersData';
import ScammerCard from './ScammerCard';
import FilterTabs from './FilterTabs';
import ScamReportDialog from './ScamReportDialog';

const HallOfShame = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'busted'>('all');
  const [filteredScammers, setFilteredScammers] = useState(scammers);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('hall-of-shame');
      if (section) {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight / 1.5;
        setIsVisible(isInView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial render
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredScammers(scammers);
    } else {
      setFilteredScammers(scammers.filter(scammer => scammer.status === activeTab));
    }
  }, [activeTab]);

  return (
    <section id="hall-of-shame" className="py-24 px-6 bg-gray-50 dark:bg-gray-900 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 mb-4">
            <Flag className="h-4 w-4 mr-1" />
            <span>Exposed</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            Hall of <span className="relative">
              <span className={`${isVisible ? 'line-through-animation' : ''}`}>Fame</span>
            </span> <span className="text-red-600 dark:text-red-500">Shame</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Where we feature India's "finest" cyber criminals who think they're clever. Spoiler alert: They're not.
          </p>
        </div>

        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScammers.map((scammer, index) => (
            <ScammerCard 
              key={scammer.id} 
              scammer={scammer} 
              isVisible={isVisible} 
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 italic mb-6">
            "The problem with internet quotes is that you can't always depend on their accuracy." - Abraham Lincoln
          </p>
          <ScamReportDialog />
        </div>
      </div>
    </section>
  );
};

export default HallOfShame;
