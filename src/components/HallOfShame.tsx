
import React, { useState, useEffect } from 'react';
import { Award, Flag, ThumbsDown, ThumbsUp, User, Check, AlertTriangle } from 'lucide-react';

interface ScammerData {
  id: number;
  name: string;
  description: string;
  victims: number;
  amount: string;
  status: 'active' | 'busted';
  type: string;
}

const scammers: ScammerData[] = [
  {
    id: 1,
    name: "The 'Microsoft Support' Caller",
    description: "Calls unsuspecting victims claiming to be Microsoft support, charges for fixing nonexistent problems.",
    victims: 1243,
    amount: "₹1.8 Cr",
    status: 'active',
    type: 'Tech Support Scam'
  },
  {
    id: 2,
    name: "Fake Bank Executive Gang",
    description: "Poses as bank officials to trick customers into revealing OTPs and passwords.",
    victims: 857,
    amount: "₹4.2 Cr",
    status: 'active',
    type: 'Banking Fraud'
  },
  {
    id: 3,
    name: "Matrimonial Profile Scammer",
    description: "Creates fake profiles on matrimonial sites to extort money from hopeful singles.",
    victims: 421,
    amount: "₹98 L",
    status: 'busted',
    type: 'Social Engineering'
  },
  {
    id: 4,
    name: "Cryptocurrency 'Investment' Scheme",
    description: "Promises 300% returns on crypto investments that mysteriously disappear.",
    victims: 732,
    amount: "₹6.1 Cr",
    status: 'active',
    type: 'Investment Fraud'
  },
  {
    id: 5,
    name: "The 'Lottery Winner' Emailer",
    description: "Sends emails announcing lottery wins requiring 'processing fees' to claim.",
    victims: 362,
    amount: "₹72 L",
    status: 'busted',
    type: 'Email Scam'
  }
];

const HallOfShame = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'busted'>('all');
  const [filteredScammers, setFilteredScammers] = useState<ScammerData[]>(scammers);
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
    <section id="hall-of-shame" className="py-24 px-6 bg-gray-50 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-600 mb-4">
            <Flag className="h-4 w-4 mr-1" />
            <span>Exposed</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            Hall of <span className="relative">
              <span className={`${isVisible ? 'line-through-animation' : ''}`}>Fame</span>
            </span> <span className="text-red-600">Shame</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Where we feature India's "finest" cyber criminals who think they're clever. Spoiler alert: They're not.
          </p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScammers.map((scammer, index) => (
            <div 
              key={scammer.id}
              className={`glass-card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isVisible ? 'animate-fade-up opacity-100' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    scammer.status === 'active' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {scammer.status === 'active' ? 
                      <AlertTriangle className="h-3 w-3 mr-1" /> : 
                      <Check className="h-3 w-3 mr-1" />
                    }
                    {scammer.status === 'active' ? 'Still Active' : 'Busted'}
                  </span>
                  <h3 className="text-lg font-semibold mt-2">{scammer.name}</h3>
                  <span className="text-xs text-gray-500 font-medium">{scammer.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-5 w-5 text-red-500" />
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">{scammer.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">{scammer.victims.toLocaleString()} victims</span>
                </div>
                <div className="font-medium">
                  <span className="text-red-600">{scammer.amount}</span> defrauded
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Verify if encountered</span>
                </div>
                <button className="text-sm text-primary font-medium hover:underline">
                  Report Info
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500 italic mb-4">
            "The problem with internet quotes is that you can't always depend on their accuracy." - Abraham Lincoln
          </p>
          <button className="text-primary font-medium hover:underline flex items-center gap-1 mx-auto">
            <Flag className="h-4 w-4" />
            <span>Submit a New Scam Report</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HallOfShame;
