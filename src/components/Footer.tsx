
import React from 'react';
import { Shield, Mail, Phone, Twitter, Facebook, Linkedin, Instagram, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">CyberShield India</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              A digital bug bounty program dedicated to combating cyber crime and scams in India through community-driven reporting and awareness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#bounty" className="text-gray-600 hover:text-primary transition-colors">Bug Bounty Program</a>
              </li>
              <li>
                <a href="#hall-of-shame" className="text-gray-600 hover:text-primary transition-colors">Hall of Shame</a>
              </li>
              <li>
                <a href="#resources" className="text-gray-600 hover:text-primary transition-colors">Reporting Resources</a>
              </li>
              <li>
                <a href="#activity-map" className="text-gray-600 hover:text-primary transition-colors">Activity Map</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Submit a Report</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">GDPR Compliance</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Disclaimer</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <a href="mailto:info@cybershield.in" className="text-gray-600 hover:text-primary transition-colors">
                  info@cybershield.in
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-600">Cyber Crime Helpline</p>
                  <a href="tel:1930" className="font-medium text-primary">
                    1930
                  </a>
                </div>
              </li>
              <li>
                <a 
                  href="https://cybercrime.gov.in/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary font-medium hover:underline"
                >
                  <span>Official Reporting Portal</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2023 CyberShield India. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            An initiative to promote cyber security awareness in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
