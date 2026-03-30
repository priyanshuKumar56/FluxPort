"use client";

import React, { ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, MotionValue } from "framer-motion";

export function GlowCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const spot = useTransform([mx, my] as MotionValue[], ([lx, ly]: number[]) =>
    `radial-gradient(380px circle at ${lx}px ${ly}px, rgba(99,102,241,.1), transparent 68%)`
  );

  const border = useTransform([mx, my] as MotionValue[], ([lx, ly]: number[]) =>
    `radial-gradient(220px circle at ${lx}px ${ly}px, rgba(139,92,246,.5), transparent 68%)`
  );

  if (reduceMotion) {
    return (
      <div
        ref={ref}
        className={`relative rounded-2xl bg-white/[.03] border border-white/[.07] overflow-hidden ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={`relative rounded-2xl bg-white/[.03] border border-white/[.07] overflow-hidden group ${className}`}
      whileHover={{ scale: 1.014 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spot }}
      />
      <motion.div
        className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          inset: -1,
          borderRadius: "1rem",
          background: border,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      {children}
    </motion.div>
  );
}

