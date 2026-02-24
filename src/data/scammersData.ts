
export type ScammerStatus = 'active' | 'busted' | 'under-investigation';
export type ScammerSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface ScammerData {
  id: number;
  name: string;
  alias?: string;
  description: string;
  victims: number;
  amount: string;
  amountRaw: number; // in lakhs for sorting
  status: ScammerStatus;
  type: string;
  severity: ScammerSeverity;
  states: string[];
  firstReported: string;
  lastActive: string;
  reportCount: number;
  tags: string[];
}

export const scammers: ScammerData[] = [
  {
    id: 1,
    name: "The 'Microsoft Support' Caller Gang",
    alias: 'TechBuddies India',
    description: 'Calls unsuspecting victims claiming to be Microsoft support engineers. Installs remote access software (AnyDesk/TeamViewer) and drains bank accounts while "fixing" nonexistent problems.',
    victims: 1243,
    amount: '₹1.8 Cr',
    amountRaw: 180,
    status: 'active',
    type: 'Tech Support Scam',
    severity: 'high',
    states: ['Delhi', 'Haryana', 'UP'],
    firstReported: '2023-03-12',
    lastActive: '2024-01-18',
    reportCount: 342,
    tags: ['AnyDesk', 'Remote Access', 'Banking Fraud'],
  },
  {
    id: 2,
    name: 'Fake Bank Executive Gang',
    alias: 'KYC Fraudsters',
    description: 'Poses as HDFC/SBI/Paytm bank officials. Tricks customers into revealing OTPs, CVV and Aadhaar numbers under pretense of "KYC update" or "account freeze" warnings.',
    victims: 857,
    amount: '₹4.2 Cr',
    amountRaw: 420,
    status: 'active',
    type: 'Banking Fraud',
    severity: 'critical',
    states: ['Maharashtra', 'Gujarat', 'Karnataka'],
    firstReported: '2023-01-05',
    lastActive: '2024-02-01',
    reportCount: 589,
    tags: ['OTP Fraud', 'KYC', 'Vishing', 'SIM Swap'],
  },
  {
    id: 3,
    name: 'Matrimonial Profile Scammer Network',
    alias: 'NRI Love Trap',
    description: 'Creates convincing fake profiles on Shaadi.com, Jeevansathi using stolen photos of NRIs. Builds emotional trust over weeks before demanding money for "emergency" travel or medical bills.',
    victims: 421,
    amount: '₹98 L',
    amountRaw: 98,
    status: 'busted',
    type: 'Romance / Social Engineering',
    severity: 'high',
    states: ['Punjab', 'UP', 'West Bengal'],
    firstReported: '2022-09-14',
    lastActive: '2023-11-30',
    reportCount: 203,
    tags: ['Romance Scam', 'Matrimonial', 'Identity Theft'],
  },
  {
    id: 4,
    name: 'Cryptocurrency "Investment" Ring',
    alias: 'CryptoGuru India',
    description: 'Promises 200-500% returns via fake crypto trading platforms. Victims can initially "withdraw" small amounts to build trust, then lose everything when they invest large sums.',
    victims: 732,
    amount: '₹6.1 Cr',
    amountRaw: 610,
    status: 'active',
    type: 'Investment / Crypto Fraud',
    severity: 'critical',
    states: ['Maharashtra', 'Delhi', 'Tamil Nadu', 'Kerala'],
    firstReported: '2023-04-20',
    lastActive: '2024-02-10',
    reportCount: 478,
    tags: ['Crypto', 'Ponzi Scheme', 'WhatsApp Groups', 'Telegram'],
  },
  {
    id: 5,
    name: "The 'Lottery Winner' Email Operation",
    alias: 'Nigeria Connection India',
    description: 'Sends mass emails announcing lottery wins requiring "processing fees" of ₹5,000-₹50,000 to claim prizes. Escalates with fake government paperwork and legal threats.',
    victims: 362,
    amount: '₹72 L',
    amountRaw: 72,
    status: 'busted',
    type: 'Email / Advance Fee Fraud',
    severity: 'medium',
    states: ['Pan-India (online)'],
    firstReported: '2022-06-01',
    lastActive: '2023-08-15',
    reportCount: 156,
    tags: ['Email Spam', 'Advance Fee', 'Lottery'],
  },
  {
    id: 6,
    name: 'Fake Job Portal Scam',
    alias: 'IndiaJobs247 (fake)',
    description: 'Operates fake job portals and WhatsApp groups offering high-paying WFH jobs. Charges registration fees, training fees, and equipment deposits — then vanishes.',
    victims: 1890,
    amount: '₹3.4 Cr',
    amountRaw: 340,
    status: 'under-investigation',
    type: 'Job / Employment Fraud',
    severity: 'high',
    states: ['Pan-India', 'Bihar', 'Odisha', 'UP'],
    firstReported: '2023-07-12',
    lastActive: '2024-01-28',
    reportCount: 921,
    tags: ['WFH Scam', 'Job Fraud', 'WhatsApp', 'Telegram'],
  },
];
