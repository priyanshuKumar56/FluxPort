import { Badge, BarChart3, Code, LucideIcon, Play, Upload, Workflow } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'

interface WorkflowStep {
  step: string
  title: string
  description: string
  icon: LucideIcon
  color: string
}
const WorksSection = () => {
    const workflowSteps: WorkflowStep[] = [
    {
      step: "1",
      title: "Import APIs",
      description: "Connect your APIs via OpenAPI spec, cURL, or manual entry",
      icon: Upload,
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "2",
      title: "Create Tests",
      description: "Build comprehensive test suites with our intuitive interface",
      icon: Code,
      color: "from-green-500 to-emerald-500"
    },
    {
      step: "3",
      title: "Run & Monitor",
      description: "Execute tests continuously and monitor performance 24/7",
      icon: Play,
      color: "from-orange-500 to-red-500"
    },
    {
      step: "4",
      title: "Analyze Results",
      description: "Get detailed insights and AI-powered recommendations",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500"
    }
  ]
  return (
    <section className="relative z-40 py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Workflow className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with our powerful API testing platform in just four simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500 opacity-20 hidden lg:block"></div>
            
            <div className="space-y-16">
              {workflowSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col`}
                >
                  <div className="flex-1">
                    <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500`}>
                            <step.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                            <p className="text-gray-600 text-lg">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl text-white font-bold text-xl">
                      {step.step}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}

export default WorksSection