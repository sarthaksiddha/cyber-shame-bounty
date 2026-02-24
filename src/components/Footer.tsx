
import React from 'react';
import { Shield, Mail, Phone, Github, ExternalLink, Heart, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 relative overflow-hidden">
      {/* India stripe at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-white/30 to-green-600" />

      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.05),transparent_60%)]" />

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-blue-500/20 border border-orange-500/30">
                <Shield className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">CyberShield</span>
                <span className="font-bold text-lg text-orange-400"> India</span>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-sm">
              A community-driven, open-source platform dedicated to combating cyber crime
              and scams in India through crowdsourced reporting, awareness, and bounty rewards.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mb-6">
              {[
                { icon: <Github className="h-4 w-4" />, href: 'https://github.com/sarthaksiddha/cyber-shame-bounty', label: 'GitHub' },
                { icon: <Twitter className="h-4 w-4" />, href: '#', label: 'Twitter' },
                { icon: <Linkedin className="h-4 w-4" />, href: '#', label: 'LinkedIn' },
                { icon: <Instagram className="h-4 w-4" />, href: '#', label: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Emergency helpline card */}
            <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-4 w-4 text-red-400" />
                <span className="text-xs text-red-300 font-semibold uppercase tracking-wide">Emergency Helpline</span>
              </div>
              <div className="text-3xl font-bold text-white font-display">1930</div>
              <div className="text-xs text-gray-500 mt-0.5">National Cyber Crime Helpline · 24/7</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Bounty Program', href: '/bounty-program', isLink: true },
                { label: 'Hall of Shame', href: '/#hall-of-shame' },
                { label: 'Crime Map', href: '/#activity-map' },
                { label: 'Resources', href: '/#resources' },
                { label: 'Submit a Report', href: '#', onClick: true },
              ].map((item) =>
                item.isLink ? (
                  <li key={item.label}>
                    <Link to={item.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label}>
                    <a href={item.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                      {item.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance', 'Disclaimer'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Resources */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Report Online</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors group"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>cybercrime.gov.in</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.cert-in.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>CERT-In</span>
                </a>
              </li>
              <li>
                <a href="mailto:incident@cert-in.org.in" className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  <span>incident@cert-in.org.in</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sarthaksiddha/cyber-shame-bounty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>Contribute on GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>
            © {currentYear} CyberShield India. Open source under MIT license.
          </p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for India's digital safety.
            Aligned with{' '}
            <a href="https://www.cert-in.org.in/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 underline underline-offset-2">
              CERT-In
            </a>{' '}
            &{' '}
            <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 underline underline-offset-2">
              MHA guidelines
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
