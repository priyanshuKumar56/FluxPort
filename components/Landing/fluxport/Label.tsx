"use client";

import React, { useRef } from "react";
import { useScrollReveal } from "./useScrollReveal";

export function Label({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useScrollReveal(ref as React.MutableRefObject<HTMLElement | null>, { y: 18, duration: 0.7 });
  return <p ref={ref} className="text-indigo-400 text-[11px] font-semibold tracking-[0.26em] uppercase mb-5">{text}</p>;
}

