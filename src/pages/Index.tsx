
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HallOfShame from '../components/HallOfShame';
import Resources from '../components/Resources';
import ActivityMap from '../components/ActivityMap';
import Footer from '../components/Footer';
import LiveAlerts from '../components/LiveAlerts';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.closest('a')?.getAttribute('href');

      if (href?.startsWith('#') && href !== '#') {
        e.preventDefault();
        const id = href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({ top: element.offsetTop - 72, behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <LiveAlerts />
      <Header />
      <main>
        <Hero />
        <HallOfShame />
        <Resources />
        <ActivityMap />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
