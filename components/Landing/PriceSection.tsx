import React, { useRef } from 'react'
import { Button } from '../ui/button'
import { CheckCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  color: string
}
function PriceSection() {
      const pricingRef = useRef<HTMLElement>(null)
    
    const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$0",
      period: "Forever",
      description: "Perfect for individuals and small projects",
      features: [
        "1,000 API calls/month",
        "Basic monitoring",
        "Email support",
        "1 team member",
        "Standard security"
      ],
      highlighted: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for growing teams and businesses",
      features: [
        "100,000 API calls/month",
        "Advanced monitoring",
        "Priority support",
        "10 team members",
        "Enhanced security",
        "Custom integrations",
        "Analytics dashboard"
      ],
      highlighted: true,
      color: "from-orange-500 to-red-600"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Contact us",
      description: "For large organizations with specific needs",
      features: [
        "Unlimited API calls",
        "24/7 monitoring",
        "Dedicated support",
        "Unlimited team members",
        "Enterprise security",
        "Custom integrations",
        "Advanced analytics",
        "SLA guarantee"
      ],
      highlighted: false,
      color: "from-purple-500 to-pink-600"
    }
  ]
  return (
    <section ref={pricingRef} className="relative z-40 py-32 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Choose your plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-500 hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl border-0 transform scale-110'
                    : 'bg-white border-2 border-orange-100 hover:border-orange-200 hover:shadow-xl'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                )}
                
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`mb-6 ${plan.highlighted ? 'text-orange-100' : 'text-gray-600'}`}>
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-lg ${plan.highlighted ? 'text-orange-100' : 'text-gray-600'}`}>
                        {plan.period !== 'Contact us' ? `/${plan.period}` : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${plan.highlighted ? 'text-orange-200' : 'text-green-500'}`} />
                        <span className={`${plan.highlighted ? 'text-orange-100' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-white text-orange-600 hover:bg-orange-50'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700'
                    }`}
                    // onClick={onGetStarted}
                  >
                    {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default PriceSection