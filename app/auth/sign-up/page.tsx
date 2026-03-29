"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Github, Mail, Lock, User, Terminal, Sparkles, Server } from "lucide-react";
import { useAppDispatch } from "@/lib/store/hooks";
import { registerUser } from "@/lib/store/slices/authSlice";
import gsap from "gsap";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(registerUser({ email, password })).unwrap();
      router.push("/dashboard");
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex overflow-hidden selection:bg-indigo-500/30">
      {/* Left side (Desktop Visual) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/[0.04]">
        <div className="absolute inset-0 z-0">
          <img
            src="/fluxport_auth_bg_1774793700791.png"
            alt="System Infrastructure"
            className="auth-image w-full h-full object-cover opacity-60 scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050508] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-[#050508]" />
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Node Establishment: Priority A
              </div>
              <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9]">
                Establish your <br />
                <span className="text-emerald-400 italic">perimeter.</span>
              </h1>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Terminal className="w-4 h-4" />, text: "Direct-to-metal browser execution engine." },
                { icon: <Server className="w-4 h-4" />, text: "Zero-cloud local-first workspace clustering." },
                { icon: <Sparkles className="w-4 h-4" />, text: "Advanced GraphQL schema introspection." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-emerald-400">
                    {item.icon}
                  </div>
                  <span className="text-white/40 text-[13px] font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/[0.05] p-6 bg-white/[0.01] rounded-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Zap className="w-12 h-12 text-indigo-500" />
              </div>
              <div className="text-[10px] font-black text-indigo-400 tracking-widest uppercase mb-2">Architect Tip</div>
              <p className="text-white/60 text-xs italic leading-relaxed">
                "Efficiency is not about doing more; it's about eliminating what doesn't need to be done."
              </p>
            </div>
          </div>

          <div className="text-[10px] font-black tracking-widest text-white/10 uppercase">
            V_1.0.4 - SECURED TERMINAL PHASE
          </div>
        </div>
      </div>

      {/* Right side (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
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
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Establish Node.</h2>
            <p className="text-white/40 text-sm">Join the next generation of API observability.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Identity Tag</label>
              <div className="group relative transition-all">
                <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-emerald-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Architect"
                  className="w-full h-14 bg-white/[0.02] border border-white/[0.06] rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-hidden focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Terminal</label>
              <div className="group relative transition-all">
                <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-14 bg-white/[0.02] border border-white/[0.06] rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-hidden focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Access Key</label>
              <div className="group relative transition-all">
                <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-emerald-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/[0.02] border border-white/[0.06] rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-hidden focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
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
              className="w-full h-14 bg-linear-to-r from-emerald-600 to-indigo-600 text-white font-black text-[13px] tracking-[0.1em] rounded-2xl uppercase shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? "Provisioning..." : "Connect Infrastructure"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>



          <p className="mt-10 text-center text-xs text-white/30 font-medium">
            Already an operative?{" "}
            <Link href="/auth/login" className="text-emerald-400 font-black tracking-widest uppercase hover:underline">Sync Portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
