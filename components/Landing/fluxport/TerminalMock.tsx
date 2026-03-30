"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import "./registerGsap";

export function TerminalMock() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const lines = [
    { t: "$ fluxport init my-workspace", c: "#a5b4fc" },
    { t: "  ✓ Workspace created", c: "#34d399" },
    { t: "  ✓ Environments loaded (3)", c: "#34d399" },
    { t: "$ fluxport request --method POST /api/auth", c: "#a5b4fc" },
    { t: "  → 201 Created  48ms", c: "#fbbf24" },
    { t: '  body: { "token": "eyJ0eX..." }', c: "#e2e8f0" },
    { t: "$ _", c: "#818cf8" },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) {
      gsap.set(el.querySelectorAll(".tl"), { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".tl"),
        { opacity: 0, x: -14 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.21,
          duration: 0.38,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        }
      );
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden border border-white/[.09] bg-[#0a0a13] shadow-[0_32px_80px_rgba(0,0,0,.7)]"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[.07] bg-white/[.025]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-[11px] font-mono text-white/25">fluxport — terminal</span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-[1.9] min-h-[230px]">
        {lines.map((l, i) => (
          <div key={i} className="tl" style={{ color: l.c }}>
            {l.t}
          </div>
        ))}
      </div>
    </div>
  );
}

