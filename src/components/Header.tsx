
import React, { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled 
          ? 'bg-white bg-opacity-80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="#" 
            className="flex items-center space-x-2 group"
          >
            <Shield className="h-7 w-7 text-primary transition-all duration-300 ease-in-out group-hover:scale-110" />
            <span className="font-semibold text-xl tracking-tight">CyberShield India</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <a 
              href="#bounty" 
              className="transition-all duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:bg-primary after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Bounty Program
            </a>
            <a 
              href="#hall-of-shame" 
              className="transition-all duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:bg-primary after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Hall of Shame
            </a>
            <a 
              href="#resources" 
              className="transition-all duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:bg-primary after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Resources
            </a>
            <a 
              href="#activity-map" 
              className="transition-all duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:bg-primary after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Activity Map
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } md:hidden`}
      >
        <a 
          href="#bounty" 
          className="text-2xl font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Bounty Program
        </a>
        <a 
          href="#hall-of-shame" 
          className="text-2xl font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Hall of Shame
        </a>
        <a 
          href="#resources" 
          className="text-2xl font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Resources
        </a>
        <a 
          href="#activity-map" 
          className="text-2xl font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Activity Map
        </a>
      </div>
    </header>
  );
};

export default Header;
