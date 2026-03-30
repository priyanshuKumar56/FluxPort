"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import "./registerGsap";

export function useScrollReveal<
  T extends HTMLElement = HTMLElement,
>(ref: React.MutableRefObject<T | null>, opts?: { delay?: number; y?: number; duration?: number }) {
  const reduceMotion = useReducedMotion();
  const { delay = 0, y = 55, duration = 1.05 } = opts ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) {
      // If the design uses `opacity-0` classes, make sure content is still visible.
      gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: "blur(2px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          delay,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref, reduceMotion, delay, y, duration]);
}

