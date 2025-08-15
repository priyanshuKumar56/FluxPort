import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Code, Play, BarChart3, Workflow } from "lucide-react"

interface WorkflowStep {
  step: string
  title: string
  description: string
  icon: React.ElementType
}

const WorksSection = () => {
  const workflowSteps: WorkflowStep[] = [
    {
      step: "1",
      title: "Import APIs",
      description: "Connect your APIs via OpenAPI spec, cURL, or manual entry.",
      icon: Upload
    },
    {
      step: "2",
      title: "Create Tests",
      description: "Build test suites easily with our interface.",
      icon: Code
    },
    {
      step: "3",
      title: "Run & Monitor",
      description: "Execute tests continuously and monitor performance.",
      icon: Play
    },
    {
      step: "4",
      title: "Analyze Results",
      description: "Get insights and recommendations for improvement.",
      icon: BarChart3
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-500 text-white">
            <Workflow className="w-4 h-4 mr-2" />
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Just four steps to start testing your APIs.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {workflowSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
            >
              {/* Step Number */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                  {step.step}
                </div>
              </div>

              {/* Step Card */}
              <Card className="flex-1 border border-gray-200">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorksSection
