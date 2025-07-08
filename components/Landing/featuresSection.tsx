import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Globe, 
  Activity, 
  Database, 
  CheckCircle,
  Workflow
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  details: string[];
}

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0)
    const featuresRef = useRef<HTMLElement>(null);
  useEffect(()=>{
    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 6)
    }, 4000);

    return () => clearInterval(featureInterval);
  })

  

  const features: Feature[] = [
    {
      icon: Zap,
      title: "Lightning Fast Testing",
      description: "Execute thousands of API tests in seconds with our optimized testing engine",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      textColor: "text-orange-600",
      details: ["Parallel execution", "Smart caching", "Real-time results"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption with OAuth2, JWT, and API key management",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      textColor: "text-green-600",
      details: ["Zero-trust architecture", "SOC2 compliance", "End-to-end encryption"]
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Test from 50+ locations worldwide with our distributed infrastructure",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      textColor: "text-blue-600",
      details: ["Multi-region testing", "Edge locations", "Latency optimization"]
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "24/7 uptime monitoring with intelligent alerting and incident management",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      textColor: "text-purple-600",
      details: ["Smart alerts", "Incident tracking", "Performance metrics"]
    },
    {
      icon: Database,
      title: "Advanced Analytics",
      description: "Deep insights into API performance with ML-powered recommendations",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
      textColor: "text-indigo-600",
      details: ["ML insights", "Predictive analytics", "Custom dashboards"]
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Create complex testing workflows with our visual pipeline builder",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-green-50",
      textColor: "text-teal-600",
      details: ["Visual builder", "CI/CD integration", "Automated deployment"]
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={featuresRef} className="relative z-40 py-32 bg-white/60 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Everything you need for 
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent block">
              API Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From testing to monitoring, security to analytics - we've got every aspect of your API workflow covered with enterprise-grade features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`${feature.bgColor} border-2 border-transparent hover:border-orange-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-10 -mt-10"></div>
                
                <div
                  className={`h-20 w-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110`}
                >
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className={`${feature.textColor} font-bold text-xl mb-4 group-hover:scale-105 transition-transform`}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;