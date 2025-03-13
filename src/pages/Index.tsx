
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HallOfShame from '../components/HallOfShame';
import Resources from '../components/Resources';
import ActivityMap from '../components/ActivityMap';
import Footer from '../components/Footer';

const Index = () => {
  // Smooth scroll to section when clicking on anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.closest('a')?.getAttribute('href');
      
      if (href?.startsWith('#') && href !== '#') {
        e.preventDefault();
        const id = href.slice(1);
        const element = document.getElementById(id);
        
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <HallOfShame />
        <Resources />
        <ActivityMap />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
