"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import "./registerGsap";

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(pointer: coarse)").matches ?? false;
}

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [big, setBig] = useState(false);
  const bigRef = useRef(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    if (isCoarsePointer()) return;

    document.documentElement.classList.add("fluxport-custom-cursor-enabled");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let rafId: number | null = null;
    let mounted = true;

    const setBigIfNeeded = (next: boolean) => {
      if (bigRef.current === next) return;
      bigRef.current = next;
      setBig(next);
    };

    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Cheap hover detection using closest() (no MutationObserver / listener stacking).
      const target = e.target as HTMLElement | null;
      const hoverable = !!target?.closest?.("a,button,[data-hover]");
      setBigIfNeeded(hoverable);
    };

    const tick = () => {
      if (!mounted) return;
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;

      // Dot follows the cursor directly.
      gsap.set(dot, { x: mx, y: my, xPercent: -50, yPercent: -50 });
      // Ring lags slightly for the “premium” feel.
      gsap.set(ring, { x: rx, y: ry, xPercent: -50, yPercent: -50 });

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId != null) cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("fluxport-custom-cursor-enabled");
    };
  }, [reduceMotion]);

  // If cursor is disabled, render nothing.
  if (reduceMotion || isCoarsePointer()) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full mix-blend-screen transition-[width,height,background,box-shadow] duration-200"
        style={{
          width: big ? 18 : 8,
          height: big ? 18 : 8,
          background: big ? "#a5b4fc" : "#6366f1",
          boxShadow: big ? "0 0 18px #a5b4fc" : "0 0 8px #6366f1",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border transition-[width,height,border-color,box-shadow] duration-300"
        style={{
          width: big ? 58 : 36,
          height: big ? 58 : 36,
          borderColor: big ? "rgba(165,180,252,.6)" : "rgba(99,102,241,.4)",
          boxShadow: big ? "0 0 18px rgba(165,180,252,.18)" : "none",
        }}
      />
    </>
  );
}

