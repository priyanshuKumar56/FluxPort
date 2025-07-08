import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Star, Users } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
  image: string
}
export const TestimonialSec = () => {
      const [currentTestimonial, setCurrentTestimonial] = useState(0)
    
    useEffect(()=>{
         const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
     return () => {
    
      clearInterval(testimonialInterval)
     }
    }
    ,[]
)
    const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Senior Developer at TechCorp",
      company: "TechCorp",
      content: "This platform revolutionized our API testing workflow. The AI-powered suggestions caught edge cases we never considered.",
      avatar: "SC",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Mike Rodriguez",
      role: "DevOps Engineer at StartupXYZ",
      company: "StartupXYZ",
      content: "The monitoring and alerting system is incredible. We reduced our incident response time by 80%.",
      avatar: "MR",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Lisa Wang",
      role: "API Architect at Enterprise Inc",
      company: "Enterprise Inc",
      content: "Finally, a tool that handles both testing and production monitoring seamlessly. Game changer!",
      avatar: "LW",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "David Kim",
      role: "Full Stack Developer at Innovate Co",
      company: "Innovate Co",
      content: "The collaborative features and real-time testing make team development so much smoother.",
      avatar: "DK",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ]
  return (
   <section className="relative z-40 py-32 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <Users className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              What developers say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from the developers who use our platform daily
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 shadow-2xl">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-2xl text-gray-800 mb-8 italic leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].role}
                      </div>
                      <div className="text-orange-600 font-medium">
                        {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-orange-500 w-8'
                      : 'bg-orange-200 hover:bg-orange-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}
