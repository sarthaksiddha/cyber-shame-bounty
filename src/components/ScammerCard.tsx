
import React from 'react';
import { AlertTriangle, Check, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { ScammerData } from '../data/scammersData';

interface ScammerCardProps {
  scammer: ScammerData;
  isVisible: boolean;
  index: number;
}

const ScammerCard = ({ scammer, isVisible, index }: ScammerCardProps) => {
  return (
    <div 
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
  );
};

export default ScammerCard;
