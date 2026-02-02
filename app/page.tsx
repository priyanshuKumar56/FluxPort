"use client"


import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"

import React, { useEffect, useRef, useState } from 'react';
import {
  Workflow, GitBranch, Layers, Copy, Terminal,
  FolderOpen, Folder, Plus, ZapIcon, Check,
  ChevronDown, Triangle, Box, Figma, Github,
  Framer, Slack, Twitter, Linkedin,
  Zap
} from 'lucide-react';
import Link from "next/link";

export default function IndexPage() {
  const [activeElements, setActiveElements] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
    // Intersection Observer for reveal animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveElements(prev => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    // Parallax scroll effect



  }, [user, router]);

  return (
    <div className="antialiased bg-white selection:bg-indigo-100 selection:text-indigo-800">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #ffffff; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes dash {
          0%, 100% { stroke-dashoffset: 251.2; }
          50% { stroke-dashoffset: 50; }
        }

        .animate-float { animation: float-slow 8s ease-in-out infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }

        [data-reveal] {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-reveal].active {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal].scale {
          transform: scale(0.95);
        }
        [data-reveal].scale.active {
          transform: scale(1);
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center font-bold text-sm shadow-lg shadow-black/20 group-hover:rotate-3 transition-transform">
              F
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">FluxPort</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Product</a>
            <a href="#solutions" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#developers" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Developers</a>
            <a href="#pricing" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Log In</Link>
            <Link href="/auth/sign-up" className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-indigo-50 to-transparent opacity-60 blur-3xl rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-blue-50 to-transparent opacity-60 blur-3xl rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 z-10">
            <div
              data-reveal
              data-index="0"
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-600 mb-8 uppercase tracking-wider shadow-sm ${activeElements.has(0) ? 'active' : ''}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              FluxPort v2.0 Released
            </div>

            <h1
              data-reveal
              data-index="1"
              className={`text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-slate-900 mb-6 leading-[1.05] ${activeElements.has(1) ? 'active' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              The API Client <br />
              <span className="text-slate-400">for Pro Engineers.</span>
            </h1>

            <p
              data-reveal
              data-index="2"
              className={`text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-light ${activeElements.has(2) ? 'active' : ''}`}
              style={{ transitionDelay: '200ms' }}
            >
              Debug, test, and orchestrate API workflows with a native-performance engine. Designed for teams who demand precision.
            </p>

            <div
              data-reveal
              data-index="3"
              className={`flex items-center gap-4 ${activeElements.has(3) ? 'active' : ''}`}
              style={{ transitionDelay: '300ms' }}
            >
              <button className="px-6 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-0.5">
                Download App
              </button>
              <button className="px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-all hover:border-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> npm dev fluxport
              </button>
            </div>
          </div>

          {/* Hero Graphic */}
          <div className="relative h-[500px] w-full max-w-5xl mx-auto mt-12 perspective-[1000px]">

            {/* --- Main Interface Window --- */}
            <div
              id="hero-main"
              className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-20"
            >
              {/* Title Bar */}
              <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  api.stripe.com/v1/charges
                </div>
                <div className="w-4"></div>
              </div>

              {/* Content Area */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-56 border-r border-slate-100 bg-slate-50/50 p-4 hidden md:block">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Collections</span>
                      <Plus className="w-3 h-3 cursor-pointer hover:text-slate-700" />
                    </div>
                    <div className="space-y-1">
                      <div className="px-2 py-1.5 bg-white border border-slate-200 shadow-sm rounded text-xs font-medium text-slate-800 flex items-center gap-2 cursor-pointer">
                        <FolderOpen className="w-3 h-3 text-indigo-500" />
                        Payments
                      </div>
                      <div className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded flex items-center gap-2 transition-colors cursor-pointer">
                        <Folder className="w-3 h-3" />
                        Auth
                      </div>
                      <div className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded flex items-center gap-2 transition-colors cursor-pointer">
                        <Folder className="w-3 h-3" />
                        Users
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Code View */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Request Bar */}
                  <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-3">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      POST
                    </span>
                    <span className="text-xs text-slate-600 font-mono truncate">
                      https://api.stripe.com/v1/charges
                    </span>
                    <button className="ml-auto px-4 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded shadow-sm hover:bg-indigo-700 transition flex items-center gap-2">
                      Send
                    </button>
                  </div>

                  {/* Code Editor */}
                  <div className="p-6 font-mono text-xs leading-6 overflow-hidden">
                    <div className="flex gap-4">
                      {/* Line Numbers */}
                      <div className="text-slate-300 text-right select-none">
                        1<br />2<br />3<br />4<br />5
                      </div>
                      {/* Code Content */}
                      <div>
                        <span className="text-purple-600">const</span> <span className="text-blue-600">createCharge</span> <span className="text-slate-600">=</span> <span className="text-purple-600">async</span> () <span className="text-slate-600">=&gt;</span> {'{'}<br />
                        &nbsp;&nbsp;<span className="text-purple-600">await</span> stripe.charges.<span className="text-blue-600">create</span>({'{'}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;amount: <span className="text-orange-600">2000</span>,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;currency: <span className="text-green-600">"usd"</span>,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;source: <span className="text-green-600">"tok_visa"</span>,<br />
                        &nbsp;&nbsp;);<br />
                        {'}'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Floating Code Snippet (Response) --- */}
            <div
              className="absolute -right-4 top-20 bg-slate-900 rounded-lg p-4 shadow-2xl border border-slate-700 z-30 w-64 animate-float"
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-[10px] font-medium text-slate-400">Response 200 OK</span>
                <span className="text-[10px] text-emerald-400">124ms</span>
              </div>
              <div className="font-mono text-[10px] text-slate-300 leading-relaxed">
                {'{'}<br />
                &nbsp;&nbsp;"id": <span className="text-emerald-400">"ch_1Ix..."</span>,<br />
                &nbsp;&nbsp;"amount": <span className="text-indigo-400">2000</span>,<br />
                &nbsp;&nbsp;"paid": <span className="text-indigo-400">true</span>,<br />
                &nbsp;&nbsp;"status": <span className="text-emerald-400">"succeeded"</span><br />
                {'}'}
              </div>
            </div>

            {/* --- Floating Connection Node (Webhook) --- */}
            <div
              className="absolute -left-8 bottom-32 bg-white rounded-lg p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 z-30 w-48 flex items-center gap-3 animate-float"
              style={{ animationDelay: '2s' }}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Webhook Fired</div>
                <div className="text-[10px] text-slate-500">Event: charge.succeeded</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Powering Engineering Teams At</p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />

          <div className="flex animate-marquee gap-16 w-max opacity-60">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Triangle className="fill-black w-5 h-5" /> Vercel</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Box className="fill-black w-5 h-5" /> Stripe</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Figma className="w-5 h-5" /> Figma</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Github className="fill-black w-5 h-5" /> GitHub</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Framer className="w-5 h-5" /> Framer</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Slack className="w-5 h-5" /> Slack</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 max-w-2xl">
            <h2
              data-reveal
              data-index="5"
              className={`text-3xl md:text-5xl font-semibold tracking-tighter text-slate-900 mb-6 ${activeElements.has(5) ? 'active' : ''}`}
            >
              A workspace that <br /> thinks like a developer.
            </h2>
            <p
              data-reveal
              data-index="6"
              className={`text-lg text-slate-500 ${activeElements.has(6) ? 'active' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              FluxPort reimagines the HTTP client as a networked graph of operations, not just a list of endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Visual Workflow */}
            <div
              data-reveal
              data-index="7"
              className={`md:col-span-8 bg-slate-50 rounded-2xl border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative group ${activeElements.has(7) ? 'active' : ''}`}
            >
              <div className="relative z-10 max-w-sm">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                  <Workflow className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Visual Chain Builder</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Connect request outputs to inputs visually. Extract tokens from login and pass them to authenticated endpoints automatically.
                </p>
              </div>
              <div className="absolute top-10 right-0 md:-right-10 w-3/4 h-full pointer-events-none">
                <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 400 300" fill="none">
                  <rect x="50" y="50" width="120" height="60" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                  <text x="65" y="85" fontFamily="Inter" fontSize="10" fill="#1e293b" fontWeight="600">POST /login</text>
                  <rect x="250" y="150" width="120" height="60" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                  <text x="265" y="185" fontFamily="Inter" fontSize="10" fill="#1e293b" fontWeight="600">GET /user/profile</text>
                  <path d="M110 110 C 110 150, 250 110, 310 150" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" className="group-hover:stroke-indigo-400 transition-colors duration-500" />
                  <circle r="4" fill="#4f46e5">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M110 110 C 110 150, 250 110, 310 150" />
                  </circle>
                </svg>
              </div>
            </div>

            {/* Git Native */}
            <div
              data-reveal
              data-index="8"
              className={`md:col-span-4 bg-slate-900 text-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between ${activeElements.has(8) ? 'active' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900 z-0" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Git Native</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Everything is a file. Commit your collections to Git, review PRs, and run tests in CI.
                </p>
              </div>
              <div className="relative z-10 mt-8 font-mono text-xs text-slate-300 bg-black/30 p-3 rounded border border-white/10">
                $ git commit -m "feat: add user api"<br />
                <span className="text-emerald-400">1 file changed, 12 insertions(+)</span>
              </div>
            </div>

            {/* Performance */}
            <div
              data-reveal
              data-index="9"
              className={`md:col-span-4 bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-center items-center text-center ${activeElements.has(9) ? 'active' : ''}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="relative w-24 h-24 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#4f46e5"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="50"
                    strokeLinecap="round"
                    style={{ animation: 'dash 2s ease-in-out infinite' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-slate-900">0.4s</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Cold Start</h3>
              <p className="text-xs text-slate-500 mt-2">Rust-based engine, zero electron bloat.</p>
            </div>

            {/* Smart Environments */}
            <div
              data-reveal
              data-index="10"
              className={`md:col-span-8 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all relative ${activeElements.has(10) ? 'active' : ''}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                    <Layers className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Environments</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Switch between local, staging, and prod with a single keystroke. Variables update instantly across all active tabs.
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-1">
                    <div className="flex items-center gap-1 border-b border-slate-100 p-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-bold text-slate-700">Production</span>
                      <ChevronDown className="w-3 h-3 text-slate-400 ml-auto" />
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">BASE_URL</span>
                        <span className="text-slate-800 bg-slate-100 px-1 rounded">api.flux.com</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">API_KEY</span>
                        <span className="text-slate-800 bg-slate-100 px-1 rounded">sk_live_...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Experience Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="lg:sticky lg:top-32 h-fit">
              <span className="text-indigo-600 font-semibold tracking-wide text-xs uppercase mb-2 block">Developer Experience</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Focus on the payload, <br />not the boilerplate.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                FluxPort auto-generates types, mocks, and client code. What you see in the response is exactly what you get in your codebase.
              </p>

              <ul className="space-y-6">
                {[
                  { num: '1', title: 'Type Generation', desc: 'Export TypeScript interfaces directly from JSON responses.' },
                  { num: '2', title: 'Instant Mocking', desc: 'Spin up a local server that mimics your production API schema.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-500 transition-colors">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">{item.num}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Stack with Parallax */}
            <div className="relative h-[600px] w-full flex items-center justify-center">
              {/* Layer 1: Code */}
              <div
                data-parallax
                data-speed="0.05"
                className="absolute top-0 left-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-10"
              >
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-slate-500">types.ts</span>
                  <Copy className="w-3 h-3 text-slate-400" />
                </div>
                <div className="font-mono text-xs leading-5">
                  <span className="text-pink-600">interface</span> User {'{'}<br />
                  &nbsp;&nbsp;id: <span className="text-pink-600">string</span>;<br />
                  &nbsp;&nbsp;email: <span className="text-pink-600">string</span>;<br />
                  &nbsp;&nbsp;role: <span className="text-emerald-600">'admin'</span> | <span className="text-emerald-600">'viewer'</span>;<br />
                  &nbsp;&nbsp;metadata: Record&lt;<span className="text-pink-600">string</span>, <span className="text-pink-600">any</span>&gt;;<br />
                  {'}'}
                </div>
              </div>

              {/* Layer 2: UI Preview */}
              <div
                data-parallax
                data-speed="0.1"
                className="absolute top-40 right-0 w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div>
                    <div className="h-2 w-24 bg-slate-200 rounded mb-1" />
                    <div className="h-2 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-slate-50 rounded border border-slate-100" />
                  <div className="h-8 w-full bg-slate-50 rounded border border-slate-100" />
                </div>
              </div>

              {/* Layer 3: Terminal */}
              <div
                data-parallax
                data-speed="0.15"
                className="absolute bottom-10 left-0 w-full max-w-md bg-[#1e1e1e] rounded-xl shadow-2xl p-4 z-30"
              >
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="font-mono text-[10px] text-slate-300">
                  &gt; flux mock --port 3000<br />
                  <span className="text-green-400">✔ Mock server running at http://localhost:3000</span><br />
                  <span className="text-slate-500">  GET /users (200 OK)</span><br />
                  <span className="text-slate-500">  POST /auth (201 Created)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">Fair pricing for everyone</h2>
          <p className="text-slate-500">Open source for individuals, powerful for teams.</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Tier */}
          <div
            data-reveal
            data-index="11"
            className={`p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors ${activeElements.has(11) ? 'active' : ''}`}
          >
            <h3 className="font-medium text-slate-900 mb-2">Personal</h3>
            <div className="text-3xl font-bold text-slate-900 mb-6">$0</div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" /> Local collections
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" /> Basic environment sync
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" /> Unlimited history
              </li>
            </ul>
            <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors">
              Download Free
            </button>
          </div>

          {/* Team Tier */}
          <div
            data-reveal
            data-index="12"
            className={`p-8 rounded-2xl border border-indigo-100 bg-indigo-50/30 relative ${activeElements.has(12) ? 'active' : ''}`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
              Pro
            </div>
            <h3 className="font-medium text-indigo-900 mb-2">Team</h3>
            <div className="text-3xl font-bold text-slate-900 mb-6">
              $15<span className="text-sm font-normal text-slate-500">/mo</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" /> Shared workspaces
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" /> Cloud mock servers
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-indigo-600" /> Role-based access
              </li>
            </ul>
            <button className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              Start Trial
            </button>
          </div>

          {/* Enterprise Tier */}
          <div
            data-reveal
            data-index="13"
            className={`p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors ${activeElements.has(13) ? 'active' : ''}`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="font-medium text-slate-900 mb-2">Enterprise</h3>
            <div className="text-3xl font-bold text-slate-900 mb-6">Custom</div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-slate-400" /> SSO / SAML
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-slate-400" /> Audit logs
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-slate-400" /> Dedicated support
              </li>
            </ul>
            <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to ship faster?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join 10,000+ developers using FluxPort to build the future of the web.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
              Get Started Free
            </button>
            <button className="w-full sm:w-auto px-8 py-3 rounded-lg border border-slate-700 text-white font-medium hover:bg-white/5 transition-colors">
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs">
                  F
                </div>
                <span className="font-bold text-slate-900">FluxPort</span>
              </div>
              <p className="text-sm text-slate-500 mb-4 max-w-xs">
                The modern standard for API development and testing.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-slate-900 transition">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-900 transition">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-900 transition">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Changelog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Legal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition">Community</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Support</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">API Reference</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 text-xs text-slate-400">
            <p>&copy; 2024 FluxPort Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}