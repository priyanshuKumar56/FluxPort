"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import "./registerGsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) {
      el.textContent = `${to}${suffix}`;
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        onEnter: () => {
          if (fired.current) return;
          fired.current = true;
          const o = { v: 0 };
          gsap.to(o, {
            v: to,
            duration: 1.9,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = Math.round(o.v) + suffix;
            },
          });
        },
      });
    });

    return () => ctx.revert();
  }, [to, suffix, reduceMotion]);

  return <span ref={ref}>0{suffix}</span>;
}

