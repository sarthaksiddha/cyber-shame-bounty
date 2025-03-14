
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Trophy, Award, Target, Star, Users, BarChart, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScamReportDialog from '../components/ScamReportDialog';
import { Toaster } from "@/components/ui/toaster";

const BountyProgram = () => {
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300 mb-4">
                <Trophy className="h-4 w-4 mr-1" />
                <span>Join the Battle Against Cybercrime</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-primary to-blue-500 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                CyberShield Bounty Program
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Help protect Indian citizens by identifying and reporting cyber scams. Earn rewards while making the digital space safer for everyone.
              </p>
              
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8"
                onClick={() => setReportDialogOpen(true)}
              >
                Submit a Report Now
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How the Bounty Program Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our platform empowers individuals to take an active role in combating cyber fraud through a simple, structured process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="futuristic-card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-4">1. Identify & Report</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Identify potential scams across websites, social media, or messaging platforms and submit detailed reports through our form.
                </p>
              </div>
              
              <div className="futuristic-card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-4">2. Validation & Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our security team verifies and analyzes each report to determine legitimacy, threat level, and potential impact.
                </p>
              </div>
              
              <div className="futuristic-card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-4">3. Rewards & Recognition</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Approved reports earn rewards based on severity and impact. Top contributors gain recognition in our community.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Reward Tiers Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mb-4">
                <Star className="h-4 w-4 mr-1" />
                <span>Reward Structure</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Bounty Reward Tiers</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our tiered reward system ensures fair compensation based on the severity and impact of reported scams.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="futuristic-card border border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-mono font-medium text-center">BASIC</h3>
                  <div className="mt-4 text-center">
                    <span className="text-4xl font-bold">₹500-₹1,000</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Simple phishing attempts</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Suspected fake websites</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Suspicious social media accounts</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setReportDialogOpen(true)}
                >
                  Report Now
                </Button>
              </div>
              
              <div className="futuristic-card border border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-mono font-medium text-center">STANDARD</h3>
                  <div className="mt-4 text-center">
                    <span className="text-4xl font-bold">₹1,000-₹5,000</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Sophisticated phishing operations</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Fake apps with limited distribution</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Small-scale fraud schemes</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setReportDialogOpen(true)}
                >
                  Report Now
                </Button>
              </div>
              
              <div className="futuristic-card border-2 border-primary scale-105 shadow-lg hover:shadow-xl transition-all">
                <div className="pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-full text-center">
                    <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                  <h3 className="text-lg font-mono font-medium text-center mt-4">PREMIUM</h3>
                  <div className="mt-4 text-center">
                    <span className="text-4xl font-bold">₹5,000-₹15,000</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Large-scale fraud operations</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Malicious apps on official stores</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Banking trojan distribution networks</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Coordinated scam campaigns</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setReportDialogOpen(true)}
                >
                  Report Now
                </Button>
              </div>
              
              <div className="futuristic-card border border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-mono font-medium text-center">ELITE</h3>
                  <div className="mt-4 text-center">
                    <span className="text-4xl font-bold">₹15,000+</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Major criminal networks</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Zero-day vulnerabilities exploits</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Critical infrastructure targeting</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Nation-state level threats</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setReportDialogOpen(true)}
                >
                  Report Now
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="futuristic-card text-center">
                <BarChart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">₹1.2Cr+</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Rewards Distributed</p>
              </div>
              
              <div className="futuristic-card text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">15,000+</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Active Contributors</p>
              </div>
              
              <div className="futuristic-card text-center">
                <AlertTriangle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">8,500+</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Scams Identified</p>
              </div>
              
              <div className="futuristic-card text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">₹850Cr+</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Damages Prevented</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Fight Against Cyber Crime?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Your vigilance can make a difference in protecting the digital ecosystem of India. Join our community of cyber guardians today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-8"
                  onClick={() => setReportDialogOpen(true)}
                >
                  Submit Your First Report
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="hover:bg-primary/10 font-medium px-8"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScamReportDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
      <Toaster />
    </div>
  );
};

export default BountyProgram;
