"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./registerGsap";

/**
 * Lenis smooth scroll synced with GSAP ScrollTrigger updates.
 * - Disabled for `prefers-reduced-motion`.
 * - Stops RAF on unmount.
 */
export function useLenisSmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    let lenis: any;
    let rafId: number | null = null;
    let mounted = true;

    const start = async () => {
      try {
        const mod = await import("@studio-freight/lenis");
        const Lenis = mod.default;
        if (!mounted) return;

        lenis = new Lenis({
          duration: 1.35,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothTouch: false,
        } as any);

        const tick = (time: number) => {
          if (!mounted) return;
          lenis?.raf(time);
          rafId = requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);

        // Keep GSAP's ScrollTrigger in sync with Lenis' scroll events.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lenis?.on?.("scroll", ScrollTrigger.update);

        gsap.ticker.lagSmoothing(0);
      } catch {
        // Graceful fallback: if Lenis fails to load, page still works.
      }
    };

    start();

    return () => {
      mounted = false;
      if (rafId != null) cancelAnimationFrame(rafId);
      lenis?.destroy?.();
    };
  }, [reduceMotion]);
}

