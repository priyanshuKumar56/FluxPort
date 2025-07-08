import React, { useState, useEffect } from 'react';
import { Database, Users, TrendingUp, Globe } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: string;
}

const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const stats: Stat[] = [
    { label: "API Requests", value: "50B+", icon: Database, color: "text-blue-600", trend: "+25%" },
    { label: "Active Users", value: "2M+", icon: Users, color: "text-green-600", trend: "+40%" },
    { label: "Uptime", value: "99.99%", icon: TrendingUp, color: "text-orange-600", trend: "+0.01%" },
    { label: "Global Regions", value: "50+", icon: Globe, color: "text-purple-600", trend: "+12%" },
  ];

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative z-40 py-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by developers worldwide
          </h2>
          <p className="text-orange-100 text-lg">
            Join millions of developers who rely on our platform
          </p>
        </div>
       
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-500 transform hover:scale-110 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300">
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-white" />
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-orange-100 mb-2">{stat.label}</div>
                <div className="text-sm text-green-200 font-medium">{stat.trend}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;