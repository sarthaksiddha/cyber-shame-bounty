
import React, { useState } from 'react';
import { X, Radio } from 'lucide-react';

const alerts = [
  { id: 1, text: 'NEW ALERT: Fake SBI SMS phishing campaign targeting UPI users — Report via 1930', type: 'critical' },
  { id: 2, text: 'WARNING: Fake job offers on WhatsApp promising WFH roles — Verify before applying', type: 'high' },
  { id: 3, text: 'NOTICE: Crypto investment scam pages impersonating RBI detected — Do NOT transfer funds', type: 'critical' },
  { id: 4, text: 'ALERT: Fake Aadhaar verification calls — UIDAI never asks for OTP over phone', type: 'high' },
  { id: 5, text: 'BUSTED: Microsoft Support scam gang arrested in Meerut — 3 arrests, ₹2.4Cr seized', type: 'info' },
  { id: 6, text: 'BOUNTY PAID: ₹8,500 awarded for exposing KYC phishing network — Submit your reports!', type: 'success' },
];

const dotColor: Record<string, string> = {
  critical: 'bg-red-400',
  high: 'bg-orange-400',
  success: 'bg-green-400',
  info: 'bg-blue-400',
};

const LiveAlerts = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const doubled = [...alerts, ...alerts];

  return (
    <div className="relative bg-gray-900 dark:bg-black text-white border-b border-red-500/30 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-600 z-10">
          <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-white"></span>
          <Radio className="h-3.5 w-3.5" />
          <span className="text-xs font-bold tracking-widest uppercase">Live</span>
        </div>

        <div className="flex-1 overflow-hidden py-2.5 mx-2">
          <div className="ticker-inner text-sm text-gray-200 whitespace-nowrap">
            {doubled.map((alert, i) => (
              <span key={i} className="mr-16 inline-flex items-center gap-2">
                <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor[alert.type] ?? 'bg-gray-400'}`}></span>
                {alert.text}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-2.5 text-gray-400 hover:text-white transition-colors mr-1"
          aria-label="Dismiss alerts"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default LiveAlerts;
