"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";

import "@/components/Landing/fluxport/registerGsap";

import { apiClient } from "@/lib/api/client";
import { useLenisSmoothScroll } from "./useLenisSmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { MagneticBtn } from "./MagneticBtn";
import { GlowCard } from "./GlowCard";
import { useScrollReveal } from "./useScrollReveal";
import { SplitHeadline } from "./SplitHeadline";
import { ParallaxLayer } from "./ParallaxLayer";
import { Counter } from "./Counter";
import { Marquee } from "./Marquee";
import { Orb } from "./Orb";
import { TerminalMock } from "./TerminalMock";
import { RequestMock } from "./RequestMock";
import { Label } from "./Label";
import { FluxPortLandingBackground } from "./FluxPortLandingBackground";

import {
  Terminal,
  Layers,
  Github,
  Database,
  Workflow,
  ArrowRight,
  Code2,
  Rocket,
  Check,
  Box,
  Lock,
  Cpu,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export function FluxPortLanding() {
  useLenisSmoothScroll();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Wake up Render (backend) and Neon (DB) pre-emptively
    if (typeof window === "undefined") return;

    // Avoid repeated wakeups (React dev double-invokes effects, route transitions, etc.)
    const k = "__fluxport_warmed_v1";
    const w = window as any;
    if (w[k]) return;
    w[k] = true;

    // Fire-and-forget: don't delay first paint.
    void apiClient.wakeUp();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);

  // Navbar scroll state
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Hero: fade+scale on scroll scrub
  useEffect(() => {
    if (!heroInnerRef.current) return;

    if (reduceMotion) {
      gsap.set(heroInnerRef.current, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(heroInnerRef.current!, {
        opacity: 0,
        scale: 0.93,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current!,
          start: "top top",
          end: "38% top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  // Hero text entrance (mount)
  useEffect(() => {
    if (reduceMotion) {
      gsap.set(".hbadge", { opacity: 1, y: 0 });
      gsap.set(".hline", { opacity: 1, yPercent: 0 });
      gsap.set(".hsub", { opacity: 1, y: 0 });
      gsap.set(".hctas", { opacity: 1, y: 0 });
      gsap.set(".hmeta", { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.18 });
      tl.fromTo(".hbadge", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
        .fromTo(
          ".hline",
          { opacity: 0, yPercent: 105 },
          { opacity: 1, yPercent: 0, stagger: 0.11, duration: 0.88, ease: "power4.out" },
          "-=0.3"
        )
        .fromTo(".hsub", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.42")
        .fromTo(".hctas", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.38")
        .fromTo(".hmeta", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.28");
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  // Feature grid stagger
  const featRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!featRef.current) return;

    if (reduceMotion) {
      gsap.set(featRef.current.querySelectorAll(".fc"), { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        featRef.current!.querySelectorAll(".fc"),
        { opacity: 0, y: 48, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.075,
          duration: 0.85,
          ease: "power4.out",
          scrollTrigger: { trigger: featRef.current!, start: "top 80%" },
        }
      );
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  // Stats stagger
  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!statsRef.current) return;

    if (reduceMotion) {
      gsap.set(statsRef.current.querySelectorAll(".sc"), { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        statsRef.current!.querySelectorAll(".sc"),
        { opacity: 0, scale: 0.88, y: 28 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: statsRef.current!, start: "top 86%" },
        }
      );
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  // ── DATA ──
  const features = useMemo(
    () =>
      [
        {
          icon: <Database className="w-5 h-5" />,
          title: "Redux Architecture",
          desc: "Complex nested state for Workspaces, Environments, and Collections—isolated via surgical slice logic.",
          color: "indigo",
        },
        {
          icon: <Code2 className="w-5 h-5" />,
          title: "GraphQL + REST",
          desc: "Dual protocol engines. Pivot between structured REST and GraphQL schema-aware execution seamlessly.",
          color: "violet",
        },
        {
          icon: <Layers className="w-5 h-5" />,
          title: "Radix Primitives",
          desc: "Accessible, unstyled building blocks—Dialogs, Dropdowns—assembled into a native desktop feel.",
          color: "indigo",
        },
        {
          icon: <Workflow className="w-5 h-5" />,
          title: "Local Persistence",
          desc: "No backend required. Robust localStorage sync ensures every header and script survives page reloads.",
          color: "sky",
        },
        {
          icon: <Lock className="w-5 h-5" />,
          title: "AES-256 Encryption",
          desc: "All workspace settings encrypted before touching your disk. Tokens never leave your machine.",
          color: "emerald",
        },
        {
          icon: <Cpu className="w-5 h-5" />,
          title: "Sub-40ms Latency",
          desc: "Zero-overhead parsing. FluxPort handles 10MB+ payloads at buttery-smooth 60fps without flinching.",
          color: "amber",
        },
      ] as const,
    []
  );

  const colorMap: Record<string, string> = useMemo(
    () => ({
      indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    }),
    []
  );

  const marqItems = useMemo(
    () => [
      { icon: "⚡", text: "98% Faster than Postman" },
      { icon: "🔒", text: "Zero Cloud Persistence" },
      { icon: "🎯", text: "Sub-40ms Parse Time" },
      { icon: "🧬", text: "GraphQL Schema Browser" },
      { icon: "🌐", text: "100% Web Native" },
      { icon: "⚙️", text: "Open Source MIT" },
      { icon: "🛡️", text: "AES-256 Encrypted" },
      { icon: "🚀", text: "Next.js 15 App Router" },
    ],
    []
  );

  const sub1Ref = useRef<HTMLParagraphElement>(null);
  const sub2Ref = useRef<HTMLParagraphElement>(null);
  const sub3Ref = useRef<HTMLParagraphElement>(null);
  const breakdown1Ref = useRef<HTMLDivElement>(null);
  const breakdown2Ref = useRef<HTMLDivElement>(null);
  const env1Ref = useRef<HTMLDivElement>(null);
  const env2Ref = useRef<HTMLDivElement>(null);
  const gql1Ref = useRef<HTMLDivElement>(null);
  const gql2Ref = useRef<HTMLDivElement>(null);
  const sec1Ref = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sub1Ref as any, { y: 24, delay: 0.1 });
  useScrollReveal(sub2Ref as any, { y: 24, delay: 0.1 });
  useScrollReveal(sub3Ref as any, { y: 24, delay: 0.1 });
  useScrollReveal(breakdown1Ref as any, { y: 40, delay: 0.1 });
  useScrollReveal(breakdown2Ref as any, { y: 18, delay: 0.18 });
  useScrollReveal(env1Ref as any, { y: 50 });
  useScrollReveal(env2Ref as any, { y: 40, delay: 0.12 });
  useScrollReveal(gql1Ref as any, { y: 40 });
  useScrollReveal(gql2Ref as any, { y: 50, delay: 0.12 });
  useScrollReveal(sec1Ref as any, { y: 45 });
  useScrollReveal(sec2Ref as any, { y: 45, delay: 0.14 });
  useScrollReveal(authorRef as any, { y: 40 });
  useScrollReveal(ctaRef as any, { y: 50 });

  const roadmapItems = useMemo(
    () => [
      {
        phase: "Phase 1",
        title: "Local Client — Complete",
        desc: "Complete rewrite of the core Request/Response engine and UI from the ground up.",
        done: true,
      },
      {
        phase: "Phase 2",
        title: "WebSocket Support",
        desc: "Bidirectional streaming — WS, Socket.io, SSE connections.",
        done: false,
      },
      {
        phase: "Phase 3",
        title: "AI Mock Generation",
        desc: "Using local LLMs to auto-generate exact JSON response mocks from schema definitions.",
        done: false,
      },
      {
        phase: "Phase 4",
        title: "Team Collaboration",
        desc: "Real-time multiplayer editing with CRDT conflict resolution and RBAC.",
        done: false,
      },
    ],
    []
  );

  // IMPORTANT: do NOT call hooks inside loops.
  const road1Ref = useRef<HTMLDivElement>(null);
  const road2Ref = useRef<HTMLDivElement>(null);
  const road3Ref = useRef<HTMLDivElement>(null);
  const road4Ref = useRef<HTMLDivElement>(null);
  useScrollReveal(road1Ref as any, { y: 35, delay: 0 });
  useScrollReveal(road2Ref as any, { y: 35, delay: 0.08 });
  useScrollReveal(road3Ref as any, { y: 35, delay: 0.16 });
  useScrollReveal(road4Ref as any, { y: 35, delay: 0.24 });
  const roadRefs = useMemo(() => [road1Ref, road2Ref, road3Ref, road4Ref], []);

  return (
    <>
      <FluxPortLandingBackground />
      <CustomCursor />

      <div className="bg-[#06060f] min-h-screen text-slate-200 overflow-x-hidden">
        {/* ════ NAVBAR ════════════════════════════════════ */}
        <motion.nav
          className="fixed top-0 inset-x-0 z-50 px-6 md:px-12 h-[68px] flex items-center justify-between"
          animate={{
            backgroundColor: scrolled ? "rgba(6,6,15,.9)" : "rgba(6,6,15,0)",
            backdropFilter: scrolled ? "blur(22px) saturate(150%)" : "blur(0px)",
            borderBottomColor: scrolled ? "rgba(255,255,255,.06)" : "rgba(255,255,255,0)",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
          }}
          transition={{ duration: 0.45 }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-extrabold text-[15px] text-white shadow-[0_0_22px_rgba(99,102,241,.45)]"
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 420, damping: 14 }}
            >
              F
            </motion.div>
            <span className="font-extrabold text-[18px] tracking-[-0.04em] text-white">FluxPort</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Roadmap", "Security"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[13px] text-white/45 hover:text-white transition-colors tracking-wide relative group"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/priyanshuKumar56/FluxPort"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-[13px] text-white/35 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Source</span>
            </a>
            <MagneticBtn href="/auth/login" variant="outline">
              Sign in
            </MagneticBtn>
            <MagneticBtn href="/auth/sign-up" variant="primary">
              Launch App <ArrowRight className="w-3.5 h-3.5" />
            </MagneticBtn>
          </div>
        </motion.nav>

        {/* ════ HERO ══════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20"
        >
          <Orb size={760} color="rgba(99,102,241,.2)" style={{ top: "-80px", left: "50%", transform: "translateX(-50%)" }} />
          <Orb size={430} color="rgba(139,92,246,.15)" style={{ bottom: "7%", right: "-4%" }} />
          <Orb size={340} color="rgba(52,211,153,.1)" style={{ bottom: "17%", left: "-4%" }} />

          <div ref={heroInnerRef} className="relative z-10 max-w-5xl mx-auto will-change-transform">
            {/* Badge */}
            <div className="hbadge opacity-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/[.07] text-indigo-300 text-[12px] font-medium mb-10 backdrop-blur-sm">
              {reduceMotion ? (
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              ) : (
                <motion.span
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
              )}
              A Personal Engineering Showcase
              <span className="text-indigo-500/50">·</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            {/* Headline */}
            <h1
              className="font-extrabold leading-[0.95] tracking-[-0.046em] text-white mb-8"
              style={{ fontSize: "clamp(3rem,8.5vw,8rem)" }}
            >
              <span className="line-clip block">
                <span className="hline line-wrap opacity-0">I built an API</span>
              </span>
              <span className="line-clip block">
                <span className="hline line-wrap opacity-0">
                  client{" "}
                  <em className="not-italic bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
                    to kill
                  </em>
                </span>
              </span>
              <span className="line-clip block">
                <span className="hline line-wrap opacity-0 text-white/28 font-light italic">the giants.</span>
              </span>
            </h1>

            <p
              className="hsub opacity-0 text-white/40 max-w-xl mx-auto leading-relaxed mb-12 font-light"
              style={{ fontSize: "clamp(1rem,1.8vw,1.18rem)" }}
            >
              Tired of bloated Electron apps and slow load times, I engineered FluxPort from the ground up — natively on
              the web. Sub-100ms, local-first, breathtakingly fast.
            </p>

            <div className="hctas opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <MagneticBtn href="/auth/sign-up" variant="primary" className="text-[14px] px-9 py-4">
                <Rocket className="w-4 h-4" /> Launch FluxPort <ArrowRight className="w-4 h-4" />
              </MagneticBtn>
              <MagneticBtn href="https://github.com/priyanshuKumar56/FluxPort" variant="outline" className="text-[14px] px-9 py-4">
                <Github className="w-4 h-4" /> View Source
              </MagneticBtn>
            </div>

            <div className="hmeta opacity-0 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/20">
              {["Next.js 15", "TypeScript", "GSAP", "Redux Toolkit", "Radix UI", "Tailwind v4"].map((t, i) => (
                <span key={t} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-white/[.09]">·</span>}
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/18"
            animate={{ opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-[10px] tracking-[0.26em] uppercase font-semibold">Scroll</span>
            {reduceMotion ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* ════ MARQUEE ═══════════════════════════════════ */}
        <div className="relative z-10 border-y border-white/[.055] bg-[#07070e]">
          <Marquee items={marqItems} />
        </div>

        {/* ════ LIVE MOCK ══════════════════════════════════ */}
        <section className="relative z-10 py-36 px-6 max-w-6xl mx-auto" id="features">
          <div className="text-center mb-20">
            <Label text="Live Preview" />
            <SplitHeadline
              text="The interface, in action."
              className="font-extrabold tracking-[-0.04em] text-white mb-5"
              style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }}
            />
            <p ref={sub1Ref} className="opacity-0 text-white/36 text-lg max-w-lg mx-auto leading-relaxed">
              Interact with this live mock of FluxPort's request panel — right here, right now.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/14 to-transparent pointer-events-none" />
            <RequestMock />
          </div>
        </section>

        {/* ════ STATS ══════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6">
          <div ref={statsRef} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { value: 98, suffix: "%", label: "Faster Startup", sub: "vs Electron apps", accent: "text-indigo-400" },
              { value: 40, suffix: "ms", label: "Internal Latency", sub: "response parsing", accent: "text-emerald-400" },
              { value: 12, suffix: "MB", label: "Memory Footprint", sub: "idle baseline", accent: "text-violet-400" },
            ].map((s) => (
              <GlowCard key={s.label} className="sc opacity-0 p-10 text-center">
                <div className={`font-extrabold leading-none tracking-[-0.05em] mb-3 ${s.accent}`} style={{ fontSize: "3.8rem" }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white font-semibold mb-1">{s.label}</div>
                <div className="text-white/28 text-sm">{s.sub}</div>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* ════ ENGINEERING BREAKDOWN ══════════════════════ */}
        <section className="relative z-10 py-36 px-6 max-w-7xl mx-auto" id="how-it-works">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <Label text="Engineering Breakdown" />
              <SplitHeadline
                text="Built to replace"
                className="font-extrabold tracking-[-0.04em] text-white leading-[1.02]"
                style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }}
              />
              <SplitHeadline
                text="the giants."
                delay={0.08}
                className="font-extrabold tracking-[-0.04em] leading-[1.02] bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent mb-8"
                style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }}
              />
              <p ref={breakdown1Ref} className="opacity-0 text-white/38 text-lg leading-relaxed mb-10">
                Postman. Insomnia. Paw. They ship entire Chromium processes just to render UI. FluxPort runs in the browser you
                already have.
              </p>
              <div ref={breakdown2Ref} className="opacity-0 space-y-4">
                <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/[.05]">
                  <div className="flex items-start gap-3">
                    <Box className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-red-400 text-[11px] font-bold uppercase tracking-wider mb-1">The Old Way</div>
                      <div className="text-white font-semibold mb-1">Electron Apps — Postman, Insomnia</div>
                      <p className="text-white/30 text-sm leading-relaxed">
                        Bundle entire Chromium instances. 500MB+ install, 3–5s cold start, constant cloud sync of your private keys.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center py-1">
                  {reduceMotion ? (
                    <div className="w-8 h-8 rounded-full border border-white/[.09] bg-white/[.04] flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-white/28 rotate-90" />
                    </div>
                  ) : (
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-8 h-8 rounded-full border border-white/[.09] bg-white/[.04] flex items-center justify-center"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-white/28 rotate-90" />
                    </motion.div>
                  )}
                </div>
                <div className="p-5 rounded-xl border border-indigo-500/24 bg-gradient-to-br from-indigo-600/8 to-violet-600/5 shadow-[0_0_38px_rgba(99,102,241,.07)]">
                  <div className="flex items-start gap-3">
                    <Rocket className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-indigo-400 text-[11px] font-bold uppercase tracking-wider mb-1">The FluxPort Way</div>
                      <div className="text-white font-semibold mb-1">Next.js 15 + Native Web APIs</div>
                      <p className="text-white/42 text-sm leading-relaxed">
                        Zero install. Powered by <strong className="text-indigo-300">Next.js App Router</strong>, styled with{" "}
                        <strong className="text-violet-300">Tailwind v4 OKLCH</strong>, and{" "}
                        <strong className="text-indigo-300">Redux Toolkit</strong>. Sub-100ms cold starts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ParallaxLayer speed={0.18} className="relative">
              <Orb size={270} color="rgba(99,102,241,.13)" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
              <TerminalMock />
            </ParallaxLayer>
          </div>
        </section>

        {/* ════ FEATURE GRID ═══════════════════════════════ */}
        <section className="relative z-10 py-32 px-6 bg-[#040409]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <Label text="Core Capabilities" />
              <SplitHeadline text="Everything you need." className="font-extrabold tracking-[-0.04em] text-white" style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }} />
              <SplitHeadline
                text="Nothing you don't."
                delay={0.08}
                className="font-extrabold tracking-[-0.04em] text-white/24"
                style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }}
              />
            </div>
            <div ref={featRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <GlowCard key={f.title} className="fc opacity-0 p-7 flex flex-col gap-4">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${colorMap[f.color]}`}>{f.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold text-[15px] mb-2">{f.title}</h3>
                    <p className="text-white/30 text-[13px] leading-relaxed">{f.desc}</p>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* ════ FEATURE DEEP DIVE 1 — Environments ════════ */}
        <section className="relative z-10 py-36 px-6 max-w-7xl mx-auto overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-44">
            <ParallaxLayer speed={0.14}>
              <div
                ref={env1Ref}
                className="opacity-0 relative aspect-video rounded-2xl overflow-hidden border border-white/[.07] shadow-[0_32px_64px_rgba(0,0,0,.6)]"
              >
                <div className="absolute inset-0 bg-[#090913] p-6">
                  <div className="text-[10px] font-mono text-white/18 mb-4 uppercase tracking-widest">Environments</div>
                  <div className="flex gap-2 mb-6">
                    {["Development", "Staging", "Production"].map((env, i) => (
                      <div
                        key={env}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${
                          i === 0
                            ? "bg-emerald-500/16 text-emerald-400 border border-emerald-500/26"
                            : "bg-white/[.04] text-white/24 border border-white/[.05]"
                        }`}
                      >
                        {env}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { key: "BASE_URL", val: "http://localhost:3000" },
                      { key: "API_KEY", val: "sk-dev-••••••••" },
                      { key: "TIMEOUT", val: "5000" },
                    ].map(({ key, val }) => (
                      <div key={key} className="flex items-center gap-3 bg-white/[.022] rounded-lg px-4 py-3 border border-white/[.04]">
                        <span className="font-mono text-emerald-400/72 text-[11px] w-28 shrink-0">{`{{${key}}}`}</span>
                        <span className="font-mono text-white/26 text-[11px] flex-1 truncate">{val}</span>
                        <Check className="w-3 h-3 text-emerald-500/38" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 px-4 py-3 bg-white/[.014] rounded-lg border border-dashed border-white/[.055]">
                    <span className="text-[11px] font-mono text-indigo-400/52">
                      → https://<span className="text-indigo-400">localhost:3000</span>/api/users
                    </span>
                  </div>
                </div>
              </div>
            </ParallaxLayer>

            <div ref={env2Ref} className="opacity-0 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                01 / DYNAMIC ENVIRONMENTS
              </div>
              <h3 className="font-extrabold text-4xl text-white leading-tight tracking-[-0.035em]">Smart Variable Binding.</h3>
              <p className="text-white/36 text-lg leading-relaxed">
                Define{" "}
                <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-sm">{"{{BASE_URL}}"}</code> once and toggle
                your entire app context between Local, Staging, and Production in one click.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  {
                    title: "Global & Local Scopes",
                    desc: "Variables scoped to workspaces — credential leaking is impossible by design.",
                  },
                  {
                    title: "Real-time Resolution",
                    desc: "See exactly what value will be injected as you type in the URL bar.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/14 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong className="text-white/86 block mb-0.5 font-semibold text-[14px]">{item.title}</strong>
                      <span className="text-white/30 text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deep Dive 2 — GraphQL */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div ref={gql1Ref} className="opacity-0 order-2 lg:order-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[11px] font-mono font-bold">
                02 / GRAPHQL NATIVE
              </div>
              <h3 className="font-extrabold text-4xl text-white leading-tight tracking-[-0.035em]">First-Class GraphQL.</h3>
              <p className="text-white/36 text-lg leading-relaxed">
                A dedicated GraphQL engine with query auto-completion, live schema introspection, and a split-pane operation view baked in.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  {
                    title: "Live Schema Browsing",
                    desc: "Point FluxPort at any endpoint and it parses the entire documentation tree instantly.",
                  },
                  { title: "Variable Injection", desc: "Dedicated JSON panes for isolated query variable testing and mutation input." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-pink-500/14 text-pink-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong className="text-white/86 block mb-0.5 font-semibold text-[14px]">{item.title}</strong>
                      <span className="text-white/30 text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <ParallaxLayer speed={0.14} className="order-1 lg:order-2">
              <div ref={gql2Ref} className="opacity-0 aspect-video rounded-2xl overflow-hidden border border-white/[.07] shadow-[0_32px_64px_rgba(0,0,0,.6)] relative">
                <div className="absolute inset-0 bg-[#090913] p-5 flex gap-3">
                  <div className="flex-1 flex flex-col">
                    <div className="text-[10px] font-mono text-pink-400/48 mb-2 uppercase tracking-wider">Query</div>
                    <div className="flex-1 bg-[#0d0d17] rounded-lg p-3.5 font-mono text-[11px] leading-[1.8] border border-white/[.042]">
                      <span className="text-pink-400">query </span>
                      <span className="text-white/58">GetUsers </span>
                      <span className="text-white/22">{"{"}</span>
                      <br />
                      <span className="ml-4 text-violet-300">users</span>
                      <span className="text-white/22"> {"{"}</span>
                      <br />
                      <span className="ml-8 text-sky-300">id</span>
                      <br />
                      <span className="ml-8 text-sky-300">name</span>
                      <br />
                      <span className="ml-8 text-sky-300">email</span>
                      <br />
                      <span className="ml-4 text-white/22">{"}"}</span>
                      <br />
                      <span className="text-white/22">{"}"}</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="text-[10px] font-mono text-emerald-400/48 mb-2 uppercase tracking-wider">Response</div>
                    <div className="flex-1 bg-[#0d0d17] rounded-lg p-3.5 font-mono text-[11px] leading-[1.8] border border-white/[.042]">
                      <span className="text-white/20">{"{"}</span>
                      <br />
                      <span className="ml-4 text-sky-300">"data"</span>
                      <span className="text-white/20">: {"{"}</span>
                      <br />
                      <span className="ml-8 text-sky-300">"users"</span>
                      <span className="text-white/20">: [</span>
                      <br />
                      <span className="ml-10 text-white/20">{"{ "}</span>
                      <span className="text-emerald-400">"id"</span>
                      <span className="text-white/36">: 1,</span>
                      <br />
                      <span className="ml-12 text-emerald-400">"name"</span>
                      <span className="text-white/36">: "Alice" {"}"}</span>
                      <br />
                      <span className="ml-8 text-white/20">]</span>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* ════ ROADMAP ════════════════════════════════════ */}
        <section className="relative z-10 py-32 px-6 bg-[#040409]" id="roadmap">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <Label text="Roadmap" />
              <SplitHeadline
                text="What's coming next."
                className="font-extrabold tracking-[-0.04em] text-white"
                style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }}
              />
            </div>
            <div className="relative pl-14">
              <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/55 via-indigo-500/18 to-transparent" />
              <div className="space-y-8">
                {roadmapItems.map((item, i) => (
                  <div ref={roadRefs[i] as any} key={item.title} className="relative opacity-0">
                    <div
                      className={`absolute -left-[2.1rem] top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                        item.done
                          ? "border-indigo-500 bg-indigo-600/28 shadow-[0_0_14px_rgba(99,102,241,.55)]"
                          : "border-white/13 bg-[#04040a]"
                      }`}
                    >
                      {item.done && <Check className="w-2.5 h-2.5 text-indigo-300" />}
                    </div>
                    <GlowCard className={`p-6 ${item.done ? "border-indigo-500/22 bg-indigo-500/[.05]" : ""}`}>
                      <div className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-2 ${item.done ? "text-indigo-400" : "text-white/20"}`}>
                        {item.phase} {item.done && "· Released"}
                      </div>
                      <h4 className="text-white font-semibold text-[16px] mb-2">{item.title}</h4>
                      <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
                    </GlowCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════ SECURITY ═══════════════════════════════════ */}
        <section className="relative z-10 py-36 px-6 overflow-hidden" id="security">
          <Orb size={500} color="rgba(99,102,241,.1)" style={{ top: "50%", right: "-4%", transform: "translateY(-50%)" }} />
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div ref={sec1Ref} className="opacity-0 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold uppercase tracking-wider">
                Security First
              </div>
              <h2 className="font-extrabold text-white leading-tight tracking-[-0.04em]" style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }}>
                Your data never<br />
                leaves your side.
              </h2>
              <p ref={sub2Ref} className="text-white/36 text-lg leading-relaxed">
                FluxPort was born from frustration with cloud-syncing clients that store your API paths and tokens on their servers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { dot: "bg-red-500", title: "AES-256 Storage", desc: "Workspace settings encrypted before touching disk." },
                  { dot: "bg-emerald-500", title: "Zero Cloud", desc: "No database of your requests — ever." },
                  { dot: "bg-indigo-500", title: "Local Keys", desc: "RSA pairs generated locally in kernel keychain." },
                  { dot: "bg-violet-500", title: "Open Source", desc: "Every line auditable. No hidden telemetry." },
                ].map((item) => (
                  <GlowCard key={item.title} className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                      <span className="text-white font-semibold text-[13px]">{item.title}</span>
                    </div>
                    <p className="text-white/26 text-[12px] leading-relaxed">{item.desc}</p>
                  </GlowCard>
                ))}
              </div>
            </div>

            <ParallaxLayer speed={0.2}>
              <div
                ref={sec2Ref}
                className="opacity-0 relative rounded-2xl border border-white/[.07] bg-[#0a0a14] p-8 font-mono text-[13px] leading-7 shadow-[0_32px_80px_rgba(0,0,0,.7)]"
              >
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[.055]">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[11px] text-white/18">security — console</span>
                </div>
                {[
                  { t: "$ fluxport security --init", c: "#a5b4fc" },
                  { t: "  Generating RSA-4096 keypair...", c: "#475569" },
                  { t: "  ✓ Keys secured in kernel keychain", c: "#34d399" },
                  { t: "  Enabling AES-256-GCM storage...", c: "#475569" },
                  { t: "  ✓ All workspace data encrypted", c: "#34d399" },
                  { t: "  ✓ Zero cloud sync — verified", c: "#34d399" },
                  { t: "  Security audit: PASSED ✓", c: "#34d399" },
                  { t: "$ _", c: "#818cf8" },
                ].map((line, i) =>
                  reduceMotion ? (
                    <div key={i} style={{ color: line.c }}>
                      {line.t}
                    </div>
                  ) : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i + 0.3 }}
                      style={{ color: line.c }}
                    >
                      {line.t}
                    </motion.div>
                  )
                )}
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* ════ AUTHOR QUOTE ═══════════════════════════════ */}
        <section className="relative z-10 py-24 border-t border-white/[.055]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div ref={authorRef} className="opacity-0">
              <Terminal className="w-10 h-10 text-white/[.08] mx-auto mb-8" />
              <blockquote
                className="font-extrabold text-white leading-tight tracking-[-0.04em] mb-10 opacity-88"
                style={{ fontSize: "clamp(1.5rem,4vw,2.8rem)" }}
              >
                "Code is poetry when every
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
                  cycle is accounted for.
                </span>
                "
              </blockquote>
              <p ref={sub3Ref} className="text-white/26 text-base max-w-lg mx-auto leading-relaxed mb-12">
                FluxPort isn't a venture-backed product. It's an obsession — a statement that developer tools should be fast, private,
                and breathtakingly beautiful.
              </p>
              <div className="inline-flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-extrabold text-lg mb-2 shadow-[0_0_20px_rgba(99,102,241,.35)] border border-indigo-500/28">
                  P
                </div>
                <span className="text-white font-semibold tracking-tight">Priyanshu Kumar</span>
                <span className="text-indigo-400 text-[11px] uppercase font-bold tracking-widest">Architect & Lead Engineer</span>
              </div>
            </div>
          </div>
        </section>

        {/* ════ FINAL CTA ══════════════════════════════════ */}
        <section className="relative z-10 py-44 px-6 overflow-hidden">
          <Orb size={700} color="rgba(99,102,241,.14)" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          <div className="max-w-3xl mx-auto text-center relative">
            <div ref={ctaRef} className="opacity-0">
              <Label text="Ready to start?" />
              <h2 className="font-extrabold text-white leading-[0.92] tracking-[-0.05em] mb-8" style={{ fontSize: "clamp(2.8rem,8vw,7rem)" }}>
                Explore
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">the build.</span>
              </h2>
              <p className="text-white/30 text-lg mb-14 max-w-lg mx-auto leading-relaxed">
                This isn't a startup landing page. This is a testament to what a single passionate engineer can build with modern web architecture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticBtn href="/auth/sign-up" variant="primary" className="text-[14px] px-10 py-4">
                  <Rocket className="w-4 h-4" /> Open FluxPort Live <ArrowUpRight className="w-4 h-4" />
                </MagneticBtn>
                <MagneticBtn href="https://github.com" variant="outline" className="text-[14px] px-10 py-4">
                  <Github className="w-4 h-4" /> View Source Code
                </MagneticBtn>
              </div>
            </div>
          </div>
        </section>

        {/* ════ FOOTER ═════════════════════════════════════ */}
        <footer className="relative z-10 border-t border-white/[.055] py-12 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_12px_rgba(99,102,241,.28)]">
                F
              </div>
              <span className="text-white/52 text-sm font-bold">FluxPort</span>
              <span className="text-white/13 text-sm">·</span>
              <span className="text-white/16 text-[12px]">Designed for the next generation of engineers.</span>
            </div>
            <div className="flex items-center gap-8">
              {["Documentation", "GitHub", "Privacy Policy"].map((link) => (
                <a key={link} href="#" className="text-[12px] text-white/22 hover:text-white/55 transition-colors">
                  {link}
                </a>
              ))}
            </div>
            <p className="text-[11px] text-white/14">© 2025 FluxPort Architecture. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

