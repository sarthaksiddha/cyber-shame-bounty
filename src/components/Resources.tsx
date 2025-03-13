
import React, { useEffect, useRef } from 'react';
import { Phone, MessageSquare, Globe, Info, ExternalLink, Headphones, Mail, FileText, AlertTriangle } from 'lucide-react';

interface ResourceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  type: 'contact' | 'report' | 'resource';
}

const resources: ResourceItem[] = [
  {
    title: "National Cyber Crime Reporting Portal",
    description: "Official portal to report cyber crimes online in India",
    icon: <Globe className="h-6 w-6 text-primary" />,
    link: "https://cybercrime.gov.in/",
    type: 'report'
  },
  {
    title: "Cyber Crime Helpline - 1930",
    description: "24/7 helpline for immediate assistance with cyber fraud",
    icon: <Phone className="h-6 w-6 text-primary" />,
    link: "tel:1930",
    type: 'contact'
  },
  {
    title: "State Cyber Crime Cells",
    description: "Contact details for cyber crime cells across all Indian states",
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    link: "#state-contacts",
    type: 'contact'
  },
  {
    title: "RBI - Report Banking Fraud",
    description: "Resources to report banking and financial cyber crime",
    icon: <AlertTriangle className="h-6 w-6 text-primary" />,
    link: "https://rbi.org.in",
    type: 'report'
  },
  {
    title: "CERT-In (Indian Computer Emergency Response Team)",
    description: "Report technical vulnerabilities and cyber security incidents",
    icon: <Info className="h-6 w-6 text-primary" />,
    link: "https://www.cert-in.org.in/",
    type: 'report'
  },
  {
    title: "Ministry of Home Affairs - Indian Cyber Crime Coordination Centre",
    description: "Centralized platform for reporting and coordination",
    icon: <FileText className="h-6 w-6 text-primary" />,
    link: "https://www.mha.gov.in/",
    type: 'resource'
  },
  {
    title: "Cyber Dost (Police) - Twitter/X",
    description: "Official cyber safety handle by Indian Police for awareness",
    icon: <ExternalLink className="h-6 w-6 text-primary" />,
    link: "https://twitter.com/Cyberdost",
    type: 'resource'
  },
  {
    title: "Cyber Swachhta Kendra",
    description: "Botnet cleaning and malware analysis centre",
    icon: <Globe className="h-6 w-6 text-primary" />,
    link: "https://www.cyberswachhtakendra.gov.in/",
    type: 'resource'
  },
  {
    title: "National Cyber Coordination Centre (NCCC)",
    description: "Real-time threat assessment and research",
    icon: <Headphones className="h-6 w-6 text-primary" />,
    link: "mailto:incident@cert-in.org.in",
    type: 'contact'
  }
];

const ResourceCard = ({ item }: { item: ResourceItem }) => {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
    >
      <div className="mb-4">{item.icon}</div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
      <div className="flex items-center text-sm text-primary font-medium">
        <span>
          {item.type === 'contact' 
            ? 'Contact'
            : item.type === 'report' 
              ? 'Report Incident' 
              : 'Learn More'}
        </span>
        <ExternalLink className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </a>
  );
};

const Resources = () => {
  const resourcesRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'contact' | 'report' | 'resource'>('all');
  const [filteredResources, setFilteredResources] = React.useState<ResourceItem[]>(resources);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.type === activeFilter));
    }
  }, [activeFilter]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
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

    if (resourcesRef.current) {
      observer.observe(resourcesRef.current);
    }

    return () => {
      if (resourcesRef.current) {
        observer.unobserve(resourcesRef.current);
      }
    };
  }, []);

  return (
    <section id="resources" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-700 mb-4">
            <Info className="h-4 w-4 mr-1" />
            <span>Help & Resources</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Report Cyber Crime in India</h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Comprehensive list of official channels to report cyber crime incidents and get assistance.
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-gray-100">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'all' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setActiveFilter('contact')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'contact' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Helplines</span>
            </button>
            <button
              onClick={() => setActiveFilter('report')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'report' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Report</span>
            </button>
            <button
              onClick={() => setActiveFilter('resource')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                activeFilter === 'resource' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Information</span>
            </button>
          </div>
        </div>

        <div 
          ref={resourcesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 translate-y-4"
        >
          {filteredResources.map((resource, index) => (
            <ResourceCard key={index} item={resource} />
          ))}
        </div>

        <div className="mt-16 glass-card p-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Emergency Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">National Cyber Crime Helpline</p>
                <p className="text-2xl font-bold text-primary">1930</p>
                <p className="text-sm text-gray-600">Available 24/7</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Women Helpline</p>
                <p className="text-2xl font-bold text-primary">181</p>
                <p className="text-sm text-gray-600">For women-specific cyber crimes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">CERT-In Email</p>
                <p className="text-primary font-medium">incident@cert-in.org.in</p>
                <p className="text-sm text-gray-600">For technical vulnerabilities</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Emergency Police</p>
                <p className="text-2xl font-bold text-primary">112</p>
                <p className="text-sm text-gray-600">For immediate police assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
