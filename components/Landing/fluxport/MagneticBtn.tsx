"use client";

import React, { ReactNode, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export function MagneticBtn({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduceMotion) return;
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      x.set((e.clientX - r.left - r.width / 2) * 0.38);
      y.set((e.clientY - r.top - r.height / 2) * 0.38);
    },
    [reduceMotion, x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const base =
    "relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-[13px] tracking-wide select-none overflow-hidden transition-shadow duration-300";
  const styles: Record<string, string> = {
    primary:
      "px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_28px_rgba(99,102,241,.4)] hover:shadow-[0_0_48px_rgba(99,102,241,.65)]",
    outline:
      "px-7 py-3.5 border border-white/[.13] text-white/80 hover:border-indigo-500/55 hover:text-white hover:bg-white/[.04]",
    ghost: "px-5 py-2.5 text-white/45 hover:text-white",
  };

  if (reduceMotion) {
    const Tag = href ? "a" : "button";
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Tag
        {...(href ? { href } : {})}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={onClick as any}
        className={`${base} ${styles[variant]} ${className}`}
      >
        {children}
      </Tag>
    );
  }

  const Tag = (href ? motion.a : motion.button) as any;

  return (
    <Tag
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[.13] to-transparent -skew-x-12"
        initial={{ x: "-120%" }}
        whileHover={{ x: "130%", transition: { duration: 0.5, ease: "easeInOut" } }}
      />
      {children}
    </Tag>
  );
}

