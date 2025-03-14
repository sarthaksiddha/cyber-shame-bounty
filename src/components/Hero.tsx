
import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Shield, Bug, Award } from 'lucide-react';
import ScamReportDialog from './ScamReportDialog';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up', 'opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);
    if (descRef.current) observer.observe(descRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (descRef.current) observer.unobserve(descRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"
        aria-hidden="true"
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animate-delay-300" aria-hidden="true" />
      
      <div className="container mx-auto max-w-6xl z-10 text-center">
        <div className="space-y-2 mb-6 overflow-hidden">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-primary">
            <Shield className="h-4 w-4 mr-1" />
            <span>India's Digital Security Initiative</span>
          </div>
        </div>
        
        <h1 
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-balance opacity-0 translate-y-4"
        >
          Protecting India's Digital Future <br className="hidden sm:block" />
          <span className="text-primary">One Bug at a Time</span>
        </h1>
        
        <p 
          ref={descRef}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 opacity-0 translate-y-4 animate-delay-200 text-balance"
        >
          Join our nationwide bug bounty program to help combat cyber crime and make India's digital landscape safer for everyone.
        </p>
        
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 translate-y-4 animate-delay-300"
        >
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="px-8 py-4 rounded-full bg-primary text-white font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center gap-2"
          >
            <Bug className="h-5 w-5" />
            <span>Join the Program</span>
          </button>
          <a 
            href="#hall-of-shame" 
            className="px-8 py-4 rounded-full bg-white text-primary font-semibold border border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/10 transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center gap-2"
          >
            <Award className="h-5 w-5" />
            <span>View Leaderboard</span>
          </a>
        </div>
      </div>
      
      <a 
        href="#hall-of-shame"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-400 hover:text-primary transition-colors"
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>

      {/* Dialog for Join the Program */}
      {isDialogOpen && (
        <ScamReportDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
        />
      )}
    </section>
  );
};

export default Hero;
