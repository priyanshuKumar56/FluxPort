import { Badge, Eye, Lock, LucideIcon, Shield, Users } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'

interface SecurityFeature {
  icon: LucideIcon
  title: string
  description: string
}
const SecurityFeature = () => {
    const securityFeatures: SecurityFeature[] = [
    {
      icon: Shield,
      title: "Zero Trust Architecture",
      description: "Every request is verified and authenticated"
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "AES-256 encryption for all data in transit and at rest"
    },
    {
      icon: Eye,
      title: "Audit Logging",
      description: "Complete audit trail of all API interactions"
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Granular permissions and access controls"
    }
  ]
  return (
    <section className="relative z-40 py-32 bg-gradient-to-br from-slate-900 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20"><Badge className="mb-6 bg-gradient-to-r from-red-500 to-pink-600 text-white">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise Security
            </Badge>
            <h2 className="text-5xl font-bold mb-6">
              Security-first approach
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your APIs and data are protected with military-grade security measures
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default SecurityFeature