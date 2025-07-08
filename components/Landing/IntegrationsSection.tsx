import { Badge, BookOpen, BotMessageSquareIcon, Boxes, Figma, FileText, Github, LucideIcon, Slack, Target } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from '../ui/card'
interface Integration {
  name: string
  icon: LucideIcon
  color: string
}
export const IntegrationsSection = () => {
     const integrations: Integration[] = [
    { name: "GitHub", icon: Github, color: "text-gray-900" },
    { name: "Slack", icon: Slack, color: "text-purple-600" },
    { name: "Discord", icon: BotMessageSquareIcon, color: "text-indigo-600" },
    { name: "Figma", icon: Figma, color: "text-pink-600" },
    { name: "Linear", icon: Target, color: "text-blue-600" },
    { name: "Notion", icon: BookOpen, color: "text-gray-700" },
    { name: "Jira", icon: Boxes, color: "text-blue-700" },
    { name: "Confluence", icon: FileText, color: "text-blue-600" },
  ]
  return (
    <section className="relative z-40 py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <Boxes className="w-4 h-4 mr-2" />
              Integrations
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Works with your favorite tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly integrate with your existing workflow and tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <Card
                key={index}
                className="bg-gray-50 hover:bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-500 hover:scale-110 group cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <integration.icon className={`w-8 h-8 mx-auto mb-3 ${integration.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                    {integration.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}
