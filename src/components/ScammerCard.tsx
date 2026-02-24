
import React, { useState } from 'react';
import { AlertTriangle, Users, MapPin, Tag, Calendar, FileWarning, ChevronDown, ChevronUp, Share2, CheckCircle, Clock } from 'lucide-react';
import { ScammerData, ScammerSeverity, ScammerStatus } from '../data/scammersData';
import { useToast } from '@/hooks/use-toast';

const severityConfig: Record<ScammerSeverity, { label: string; classes: string; dot: string; bar: string }> = {
  critical: {
    label: 'CRITICAL',
    classes: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800/50',
    dot: 'bg-red-500',
    bar: 'bg-gradient-to-r from-red-500 to-rose-600',
  },
  high: {
    label: 'HIGH',
    classes: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50',
    dot: 'bg-orange-500',
    bar: 'bg-gradient-to-r from-orange-500 to-amber-500',
  },
  medium: {
    label: 'MEDIUM',
    classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50',
    dot: 'bg-yellow-500',
    bar: 'bg-gradient-to-r from-yellow-400 to-amber-400',
  },
  low: {
    label: 'LOW',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
    dot: 'bg-blue-500',
    bar: 'bg-gradient-to-r from-blue-400 to-blue-500',
  },
};

const statusConfig: Record<ScammerStatus, { label: string; classes: string; icon: React.ReactNode }> = {
  active: {
    label: 'ACTIVE THREAT',
    classes: 'bg-red-600 text-white',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  busted: {
    label: 'BUSTED',
    classes: 'bg-green-600 text-white',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  'under-investigation': {
    label: 'INVESTIGATING',
    classes: 'bg-amber-500 text-white',
    icon: <Clock className="h-3 w-3" />,
  },
};

interface ScammerCardProps {
  scammer: ScammerData;
  isVisible: boolean;
  index: number;
}

const ScammerCard = ({ scammer, isVisible, index }: ScammerCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const sev = severityConfig[scammer.severity];
  const stat = statusConfig[scammer.status];

  const handleShare = () => {
    const text = `⚠️ SCAM ALERT: "${scammer.name}" — ${scammer.victims.toLocaleString('en-IN')} victims, ${scammer.amount} stolen. Stay safe! Report cyber crime at 1930 or cybercrime.gov.in`;
    if (navigator.share) {
      navigator.share({ title: 'CyberShield India — Scam Alert', text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Alert copied!', description: 'Share this to warn others.' });
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden card-lift transition-all duration-500 flex flex-col ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${
        scammer.status === 'active'
          ? 'border-red-200/70 dark:border-red-900/40'
          : scammer.status === 'busted'
          ? 'border-green-200/70 dark:border-green-900/40'
          : 'border-amber-200/70 dark:border-amber-900/40'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Severity top bar */}
      <div className={`h-1 w-full ${sev.bar}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Status + severity badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${stat.classes}`}>
              {stat.icon}
              {stat.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${sev.classes}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`}></span>
              {sev.label}
            </span>
          </div>
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            title="Share alert"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Name */}
        <h3 className="font-bold text-base leading-snug mb-0.5 text-gray-900 dark:text-white">
          {scammer.name}
        </h3>
        {scammer.alias && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2.5 font-mono">
            aka "{scammer.alias}"
          </p>
        )}

        {/* Scam type */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium mb-3 self-start">
          <FileWarning className="h-3.5 w-3.5" />
          {scammer.type}
        </div>

        {/* Description */}
        <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 ${!expanded ? 'line-clamp-2' : ''}`}>
          {scammer.description}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20">
            <div className="font-bold text-red-600 dark:text-red-400 text-sm leading-none">{scammer.victims.toLocaleString('en-IN')}</div>
            <div className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />Victims
            </div>
          </div>
          <div className="text-center p-2 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/20">
            <div className="font-bold text-orange-600 dark:text-orange-400 text-sm leading-none">{scammer.amount}</div>
            <div className="text-gray-400 text-xs mt-1">Stolen</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20">
            <div className="font-bold text-blue-600 dark:text-blue-400 text-sm leading-none">{scammer.reportCount}</div>
            <div className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />Reports
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
              <span><span className="font-semibold text-gray-700 dark:text-gray-300">States: </span>{scammer.states.join(', ')}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Reported since: </span>
                {new Date(scammer.firstReported).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {scammer.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-auto pt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60"
        >
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5" /><span>Show less</span></>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /><span>Show details & tags</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScammerCard;
