
import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Bug, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScamReportDialog from './ScamReportDialog';

const navLinks = [
  { label: 'Bounty Program', to: '/bounty-program', isLink: true },
  { label: 'Hall of Shame', href: '/#hall-of-shame' },
  { label: 'Resources', href: '/#resources' },
  { label: 'Crime Map', href: '/#activity-map' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-800/50'
            : 'bg-transparent'
        }`}
      >
        {/* India stripe — only show when scrolled */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-white to-green-600" />
        )}

        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-orange-500/20 blur-sm scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-1.5 rounded-lg bg-gradient-to-br from-orange-500/10 to-blue-500/10 border border-orange-500/20">
                  <Shield className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div>
                <span className={`font-bold text-lg tracking-tight transition-colors ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                  CyberShield
                </span>
                <span className={`font-bold text-lg tracking-tight transition-colors ${scrolled ? 'text-orange-500' : 'text-orange-400'}`}>
                  {' '}India
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
                link.isLink ? (
                  <Link
                    key={link.label}
                    to={link.to!}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 ${
                      scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-gray-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://github.com/sarthaksiddha/cyber-shame-bounty"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-px"
              >
                <Bug className="h-4 w-4" />
                <span>Report Scam</span>
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-400" />
              <span className="font-bold text-white">CyberShield India</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile nav links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navLinks.map((link) =>
              link.isLink ? (
                <Link
                  key={link.label}
                  to={link.to!}
                  className="flex items-center px-4 py-3 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center px-4 py-3 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Mobile bottom actions */}
          <div className="px-6 py-6 border-t border-gray-800 space-y-3">
            <button
              onClick={() => { setReportOpen(true); setIsMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-all"
            >
              <Bug className="h-4 w-4" />
              <span>Report a Scam</span>
            </button>
            <a
              href="tel:1930"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold transition-all"
            >
              Helpline: 1930
            </a>
          </div>
        </div>
      </div>

      <ScamReportDialog open={reportOpen} onOpenChange={setReportOpen} />
    </>
  );
};

export default Header;
