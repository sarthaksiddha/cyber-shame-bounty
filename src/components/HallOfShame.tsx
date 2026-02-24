
import React, { useState, useEffect, useRef } from 'react';
import { Flag, Search, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { scammers } from '../data/scammersData';
import ScammerCard from './ScammerCard';
import ScamReportDialog from './ScamReportDialog';

type FilterTab = 'all' | 'active' | 'busted' | 'under-investigation';

const tabConfig: { id: FilterTab; label: string; count: (n: typeof scammers) => number }[] = [
  { id: 'all', label: 'All', count: (s) => s.length },
  { id: 'active', label: 'Active Threats', count: (s) => s.filter((x) => x.status === 'active').length },
  { id: 'busted', label: 'Busted', count: (s) => s.filter((x) => x.status === 'busted').length },
  { id: 'under-investigation', label: 'Investigating', count: (s) => s.filter((x) => x.status === 'under-investigation').length },
];

const HallOfShame = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = scammers.filter((s) => {
    const matchesTab = activeTab === 'all' || s.status === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q)) ||
      s.states.some((st) => st.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const totalVictims = scammers.reduce((a, b) => a + b.victims, 0);

  return (
    <section
      id="hall-of-shame"
      ref={sectionRef}
      className="py-20 px-6 bg-gray-50 dark:bg-gray-950 relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.04),transparent_60%)]" />

      <div className="container mx-auto max-w-7xl relative">
        {/* Section header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800/30 mb-5">
            <Flag className="h-4 w-4" />
            <span>Publicly Exposed</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Hall of{' '}
            <span className={`relative inline-block ${isVisible ? 'line-through-animation' : ''} text-gray-500 dark:text-gray-400`}>
              Fame
            </span>{' '}
            <span className="text-red-600 dark:text-red-500">Shame</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-3">
            India's most wanted cyber criminals — exposed by our community.{' '}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {totalVictims.toLocaleString('en-IN')} victims
            </span>{' '}
            and counting.
          </p>

          {/* Mini stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
              <span>{scammers.filter((s) => s.status === 'active').length} Active threats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span>{scammers.filter((s) => s.status === 'busted').length} Busted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span>Updated weekly</span>
            </div>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, type, state, or tag..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-gray-400 ml-2 mr-1 flex-shrink-0" />
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${activeTab === tab.id ? 'text-white/70' : 'text-gray-400'}`}>
                  {tab.count(scammers)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((scammer, index) => (
              <ScammerCard
                key={scammer.id}
                scammer={scammer}
                isVisible={isVisible}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No results for "{search}"</p>
            <p className="text-sm mt-1">Try a different scam type, state, or tag</p>
          </div>
        )}

        {/* CTA */}
        <div
          className={`text-center mt-14 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-gray-500 dark:text-gray-400 italic text-sm mb-6 max-w-md mx-auto">
            Know a scammer not listed here? Report them and help us grow this database.
          </p>
          <button
            onClick={() => setShowDialog(true)}
            className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5"
          >
            Add a Scammer Report
          </button>
        </div>
      </div>

      <ScamReportDialog open={showDialog} onOpenChange={setShowDialog} />
    </section>
  );
};

export default HallOfShame;
