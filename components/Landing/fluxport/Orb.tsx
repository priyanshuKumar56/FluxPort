"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import "./registerGsap";

export function Orb({
  size = 500,
  color = "rgba(99,102,241,.2)",
  style = {},
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    // Extra safety: infinite tweens on touch/small screens can be costly.
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    if (window.innerWidth < 640) return;
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: "-=26",
      scale: 1.06,
      duration: 8 + Math.random() * 5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none rounded-full will-change-transform"
      style={{
        width: size,
        height: size,
        filter: "blur(62px)",
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        transform: "translate3d(0,0,0)",
        ...style,
      }}
    />
  );
}

