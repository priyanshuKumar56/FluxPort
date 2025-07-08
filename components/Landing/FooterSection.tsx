import { ArrowRight, Github,  Linkedin, Rocket, Twitter } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const FooterSection = () => {
  return (
   <>
    <section className="relative z-40 py-32 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 overflow-hidden">
           <div className="absolute inset-0 bg-black/20"></div>
           <div className="container mx-auto px-6 relative z-10">
             <div className="text-center">
               <h2 className="text-5xl font-bold text-white mb-8">
                 Ready to transform your API workflow?
               </h2>
               <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto">
                 Join thousands of developers who trust our platform for their API testing and monitoring needs.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/dashboard" className="hidden sm:inline-block">
 <Button
                   size="lg"
                
                   className="bg-white text-orange-600 hover:bg-orange-50 text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
                 >
                   <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                   Start Free Trial
                   <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                 </Button>

              </Link>

                
                 
                 <Button
                   size="lg"
                   variant="outline"
                   className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-xl px-12 py-8 bg-transparent backdrop-blur-sm transition-all duration-300"
                 >
                   Schedule Demo
                 </Button>
               </div>
             </div>
           </div>
         </section>
   
         {/* Footer */}
         <footer className="relative z-40 bg-slate-900 text-white py-20">
           <div className="container mx-auto px-6">
             <div className="grid md:grid-cols-4 gap-8 mb-12">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                     <span className="text-white font-bold text-xl">AG</span>
                   </div>
                   <div>
                     <div className="font-bold text-xl">Fluxport</div>
                     <div className="text-orange-400 text-sm">Professional Suite</div>
                   </div>
                 </div>
                 <p className="text-gray-400 leading-relaxed">
                   The most powerful API testing and monitoring platform for modern developers.
                 </p>
               </div>
               
               <div>
                 <h4 className="font-semibold text-lg mb-4">Product</h4>
                 <ul className="space-y-2 text-gray-400">
                   <li><a href="#" className="hover:text-orange-400 transition-colors">API Testing</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Monitoring</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Security</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Analytics</a></li>
                 </ul>
               </div>
               
               <div>
                 <h4 className="font-semibold text-lg mb-4">Resources</h4>
                 <ul className="space-y-2 text-gray-400">
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">API Reference</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Guides</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Community</a></li>
                 </ul>
               </div>
               
               <div>
                 <h4 className="font-semibold text-lg mb-4">Company</h4>
                 <ul className="space-y-2 text-gray-400">
                   <li><a href="#" className="hover:text-orange-400 transition-colors">About</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Blog</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                   <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
                 </ul>
               </div>
             </div>
             
             <div className="border-t border-gray-800 pt-8">
               <div className="flex flex-col md:flex-row items-center justify-between">
                 <div className="text-gray-400 mb-4 md:mb-0">
                   © 2024 Fluxport. All rights reserved.
                 </div>
                 <div className="flex items-center gap-6">
                   <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                     <Github className="w-6 h-6" />
                   </a>
                   <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                     <Twitter className="w-6 h-6" />
                   </a>
                   <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                     <Linkedin className="w-6 h-6" />
                   </a>
                 </div>
               </div>
             </div>
           </div>
         </footer>
   </>
  )
}

export default FooterSection