import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ArrowRight, Rocket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
interface LandingPageProps {
  onGetStarted: () => void
}
const Navigation = ({onGetStarted}: LandingPageProps) => {
     const [loading, setLoading] = useState(false)
      const router = useRouter()
      const handleStart = async () => {
    setLoading(true)
    if (onGetStarted) onGetStarted()

    // Simulate delay (optional, remove in real use)
    await new Promise((res) => setTimeout(res, 300))

    router.push("/dashboard")
  }
  return (
   <nav className="relative z-50 flex items-center justify-between p-6 bg-white/80 backdrop-blur-xl border-b border-orange-100/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                          <Image
              src="/fp-logo.webp"
              alt="Fluxport Logo"
              width={62}
              height={62}
              className="absolute -top-1 -left-1 w-12 h-12 m-auto rounded-full border-2 border-white shadow-lg"/>
            </div>

            
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="hidden md:block">
            <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Fluxport
            </span>
            <div className="text-sm text-orange-600 font-medium">Professional Suite</div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
            Features
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
            Pricing
          </Button>
          <Link href="/documentation" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
           <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
            Docs
          </Button>
          </Link>
         
          <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
            Support
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hidden md:block">
            Sign In
          </Button>
           <Button
                size="lg"
                onClick={handleStart}
                disabled={loading}
                className={`bg-gradient-to-r from-orange-500 to-red-600 text-white text-base px-5 py-3 shadow-2xl transition-all duration-300 group ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-3xl"
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-3 w-5 h-5 border-2 border-t-white border-b-white rounded-full" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
            Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
         
        </div>
      </nav>
  )
}

export default Navigation