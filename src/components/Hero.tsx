
import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Shield, Bug, Award, ChevronRight, Phone, Users } from 'lucide-react';
import ScamReportDialog from './ScamReportDialog';

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const StatCard = ({ label, value, suffix, prefix, color, isVisible }: {
  label: string; value: number; suffix: string; prefix?: string; color: string; isVisible: boolean;
}) => {
  const count = useCountUp(value, 2000, isVisible);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all card-lift">
      <div className={`text-3xl font-bold font-display ${color}`}>
        {prefix ?? ''}{count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-gray-400 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
};

const stats = [
  { label: 'Scams Reported', value: 8547, suffix: '+', color: 'text-blue-400' },
  { label: 'Victims Helped', value: 24300, suffix: '+', color: 'text-green-400' },
  { label: 'Bounty Paid', value: 120, suffix: 'L+', prefix: '₹', color: 'text-orange-400' },
  { label: 'States Covered', value: 28, suffix: '', color: 'text-purple-400' },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

      {/* India flag stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white/60 to-green-600 z-10" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float" />
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-orange-500 rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-float animate-delay-300" />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-float animate-delay-500" />

      <div className="container mx-auto max-w-6xl z-10 text-center">

        {/* Live badge */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-white/10 text-white border border-white/20 backdrop-blur-sm">
            <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <Shield className="h-4 w-4 text-orange-400" />
            <span>India's Community Cyber Crime Shield</span>
          </div>
        </div>

        {/* Heading */}
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white text-balance transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          Expose. Report.
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
            Protect India.
          </span>
        </h1>

        {/* Subheading */}
        <p className={`text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 text-balance transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          India's community-driven bug bounty platform — report cyber scams,
          expose fraudsters, and earn rewards while making the internet safer for{' '}
          <strong className="text-white">1.4 billion Indians</strong>.
        </p>

        {/* CTA buttons */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="group px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold text-lg transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Bug className="h-5 w-5" />
            <span>Report a Scam</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#hall-of-shame"
            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-lg border border-white/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 backdrop-blur-sm"
          >
            <Award className="h-5 w-5 text-yellow-400" />
            <span>Hall of Shame</span>
          </a>

          <a
            href="tel:1930"
            className="px-6 py-4 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold border border-red-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            <span>Helpline: 1930</span>
          </a>
        </div>

        {/* Animated stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {stats.map((s) => (
            <StatCard key={s.label} {...s} isVisible={isVisible} />
          ))}
        </div>

        {/* Trust line */}
        <div className={`mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-green-500" />
            <span>Aligned with CERT-In guidelines</span>
          </div>
          <span className="text-gray-700">•</span>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <span>15,000+ community contributors</span>
          </div>
          <span className="text-gray-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-green-500 font-medium">Open Source on GitHub</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#hall-of-shame"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-500 hover:text-gray-300 transition-colors"
      >
        <span className="text-xs mb-2 tracking-widest uppercase">Scroll</span>
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>

      <ScamReportDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </section>
  );
};

export default Hero;
