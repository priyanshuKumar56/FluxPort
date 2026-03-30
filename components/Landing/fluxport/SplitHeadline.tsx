"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import "./registerGsap";

export function SplitHeadline({
  text,
  className = "",
  delay = 0,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const chars = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const nodes = el.querySelectorAll(".ch");
      gsap.fromTo(
        nodes,
        { opacity: 0, yPercent: 115, rotateX: -38, transformOrigin: "top center" },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          stagger: 0.026,
          duration: 0.82,
          delay,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, reduceMotion]);

  return (
    <div ref={ref} className={className} style={{ perspective: "900px", ...style }}>
      {chars.map((ch, i) => (
        <span key={i} className="ch" style={{ display: ch === " " ? "inline" : "inline-block" }}>
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </div>
  );
}

