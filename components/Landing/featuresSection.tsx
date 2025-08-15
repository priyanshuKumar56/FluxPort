import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Shield,
  Globe,
  Activity,
  Database,
  CheckCircle,
  Workflow
} from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  details: string[]
}

const FeaturesSection = () => {
  const features: Feature[] = [
    {
      icon: Zap,
      title: "Lightning Fast Testing",
      description: "Run API tests quickly with our optimized engine.",
      details: ["Parallel execution", "Smart caching", "Real-time results"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Secure your APIs with modern authentication and encryption.",
      details: ["OAuth2 & JWT", "SOC2 compliance", "End-to-end encryption"]
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Test from multiple locations worldwide.",
      details: ["Multi-region testing", "Edge locations", "Latency optimization"]
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Keep track of uptime and performance 24/7.",
      details: ["Smart alerts", "Incident tracking", "Performance metrics"]
    },
    {
      icon: Database,
      title: "Advanced Analytics",
      description: "Get insights into API performance.",
      details: ["ML insights", "Predictive analytics", "Custom dashboards"]
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Create and run testing workflows easily.",
      details: ["Visual builder", "CI/CD integration", "Automated deployment"]
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Features
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From testing to monitoring and security — all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border rounded-lg shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <feature.icon className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  {feature.description}
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
