# CyberShield India — Cyber Shame & Bounty Platform

<div align="center">

**A community-driven digital bounty program dedicated to combating cyber crime and scams in India.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Deploy%20Your%20Own-blue?style=for-the-badge)](#getting-started)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)
[![Made for India](https://img.shields.io/badge/Made%20for-India%20🇮🇳-orange?style=for-the-badge)]()

</div>

---

## What is CyberShield India?

CyberShield India is an open-source civic tech platform that empowers Indian citizens to **report**, **expose**, and **track** cyber criminals and scammers. Think of it as a community-run "Hall of Shame" + bounty program — where you can:

- 🐛 **Report scams** you encounter (phishing, fake bank calls, crypto fraud, etc.)
- 💰 **Earn bounty rewards** for verified high-impact reports
- 🗺️ **Explore the Crime Map** — state-wise cyber crime heatmap across India
- 🏴‍☠️ **View the Hall of Shame** — exposed scammers with victim count & financial damage
- 📞 **Access official resources** — 1930 helpline, CERT-In, RBI reporting, and more

> Built to be pitched to India's Cyber Crime Department and for general public use.

---

## Screenshots

> 📸 Screenshots will be added after the first public deployment. Run the project locally (`npm run dev`) to see it in action, or deploy to Netlify / Vercel using the configs in this repo.

**Key screens:**
- 🏠 **Hero** — cinematic dark background, animated crime counters, India flag stripe, 1930 helpline CTA
- 🏴‍☠️ **Hall of Shame** — searchable/filterable scammer cards with severity badges and expandable details
- 🗺️ **Crime Map** — state-wise heatmap with Leaflet (offline) or MapMyIndia (with API key)
- 🎯 **Bounty Program** — tiered rewards from ₹500 to ₹15,000+ for verified reports

---

## Features

| Feature | Status |
|---------|--------|
| Scam Reporting Form (multi-step) | ✅ |
| Hall of Shame (live scammer database) | ✅ |
| State-wise Crime Heatmap | ✅ |
| Bounty Program Tiers (₹500 → ₹15,000+) | ✅ |
| Official Resource Directory | ✅ |
| Dark Mode | ✅ |
| Mobile Responsive | ✅ |
| Live Alert Ticker | ✅ |
| Backend / Database | 🔜 Planned |
| User Accounts & Dashboard | 🔜 Planned |
| Admin Panel for Verification | 🔜 Planned |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Maps | Leaflet / MapMyIndia API |
| Animations | Tailwind CSS Animate |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/sarthaksiddha/cyber-shame-bounty.git
cd cyber-shame-bounty

# Install dependencies
npm install
# or with bun:
bun install

# Start the development server
npm run dev
# or:
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
cyber-shame-bounty/
├── src/
│   ├── components/          # UI components
│   │   ├── map/             # Interactive crime map components
│   │   └── ui/              # shadcn/ui base components
│   ├── data/                # Static data (scammers, crime stats)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Route-level page components
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                  # Static assets
└── ...config files
```

---

## Contributing

We welcome contributions! This is a civic tech project and every PR matters.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Ways to contribute:**
- 🐛 Report bugs via [Issues](https://github.com/sarthaksiddha/cyber-shame-bounty/issues)
- 💡 Suggest features
- 🌐 Help with Hindi / regional language translations
- 📊 Add more accurate crime statistics
- 🎨 UI/UX improvements

---

## Roadmap

- [ ] Backend API (Node.js / Supabase)
- [ ] Scam report verification workflow
- [ ] User accounts + contribution tracking
- [ ] Admin dashboard for moderation
- [ ] WhatsApp / Telegram bot for reporting
- [ ] Hindi language support
- [ ] PWA / offline support
- [ ] Integration with cybercrime.gov.in API

---

## Official Cyber Crime Resources

| Resource | Link |
|----------|------|
| National Cyber Crime Portal | [cybercrime.gov.in](https://cybercrime.gov.in/) |
| Cyber Crime Helpline | **1930** (24/7) |
| CERT-In | [cert-in.org.in](https://www.cert-in.org.in/) |
| RBI Ombudsman | [rbi.org.in](https://rbi.org.in) |
| Women Helpline | **181** |
| Police Emergency | **112** |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- Built with ❤️ for India's digital safety
- Inspired by HackerOne, Bugcrowd, and India's growing cyber security ecosystem
- Data sourced from NCRB, CERT-In, and public cyber crime reports

---

<div align="center">
  <strong>CyberShield India</strong> — Protecting India's Digital Future, One Report at a Time.<br/>
  <a href="https://cybercrime.gov.in/">Report Cyber Crime</a> ·
  <a href="https://github.com/sarthaksiddha/cyber-shame-bounty/issues">Raise an Issue</a> ·
  <a href="https://github.com/sarthaksiddha/cyber-shame-bounty/discussions">Discussions</a>
</div>
