"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Github, Mail, Lock, Check, Shield, Cpu, ChevronRight } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { loginUser } from "@/lib/store/slices/authSlice";
import gsap from "gsap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance Animation
    const ctx = gsap.context(() => {
      gsap.from(".auth-content > *", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      });
      gsap.from(".auth-image", {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: "power2.out"
      });
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.push("/dashboard");
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex overflow-hidden selection:bg-indigo-500/30">
      {/* Left: Branding & Visuals (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/[0.04]">
        <div className="absolute inset-0 z-0">
          <img
            src="/fluxport_auth_bg_1774793700791.png"
            alt="FluxPort Infrastructure"
            className="auth-image w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050508] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#050508]" />
        </div>

        <div className="relative z-10 w-full p-20 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:rotate-6 transition-transform">
              <img src="/logo.png" alt="FluxPort" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tighter">FluxPort</span>
          </Link>

          <div className="auth-content space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                System Status: Operational
              </div>
              <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9]">
                Accelerate your <br />
                <span className="text-indigo-400 italic">workflow.</span>
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Shield className="w-4 h-4" />, title: "Zero-Knowledge", desc: "Encryption by default." },
                { icon: <Cpu className="w-4 h-4" />, title: "Native Speed", desc: "No Electron bloat." }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md">
                  <div className="text-indigo-400 mb-3">{item.icon}</div>
                  <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                  <div className="text-white/30 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/[0.05] flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border border-[#050508] bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-white/30 text-xs font-medium">Joined by 2,000+ top engineers globally.</span>
            </div>
          </div>

          <div className="text-[10px] font-black tracking-widest text-white/10 uppercase">
            &copy; 2025 FluxPort Architecture · Precise Performance
          </div>
        </div>
      </div>

      {/* Right: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg">
              <img src="/logo.png" alt="FluxPort" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tighter">FluxPort</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] auth-content">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back.</h2>
            <p className="text-white/40 text-sm">Enter your system credentials to access your console.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Terminal</label>
              <div className="group relative transition-all">
                <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-indigo-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-14 bg-white/[0.02] border border-white/[0.06] rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-hidden focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Keyphrase</label>
                <Link href="#" className="text-[10px] text-indigo-400 font-black tracking-widest uppercase hover:text-indigo-300 transition-colors">Recover Account</Link>
              </div>
              <div className="group relative transition-all">
                <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-indigo-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/[0.02] border border-white/[0.06] rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-hidden focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 items-center"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-linear-to-r from-indigo-600 to-violet-600 text-white font-black text-[13px] tracking-[0.1em] rounded-2xl uppercase shadow-[0_10px_30px_rgba(99,102,241,0.25)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? "Synchronizing..." : "Initiate Protocol"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>



          <p className="mt-10 text-center text-xs text-white/30 font-medium">
            New operative?{" "}
            <Link href="/auth/sign-up" className="text-indigo-400 font-black tracking-widest uppercase hover:underline">Establish Node</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
