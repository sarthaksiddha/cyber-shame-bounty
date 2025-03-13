
export interface ScammerData {
  id: number;
  name: string;
  description: string;
  victims: number;
  amount: string;
  status: 'active' | 'busted';
  type: string;
}

export const scammers: ScammerData[] = [
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
