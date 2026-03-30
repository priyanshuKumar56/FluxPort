"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Marquee({ items }: { items: { icon: string; text: string }[] }) {
  const reduceMotion = useReducedMotion();

  const content = (
    <>
      {[...items, ...items].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-3 text-[13px] text-white/28 font-medium px-8">
          {item.icon} {item.text}
          <span className="text-white/[.07] ml-4">·</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden relative py-[13px]">
      <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-[#06060f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-[#06060f] to-transparent z-10 pointer-events-none" />
      {reduceMotion ? (
        <div className="flex whitespace-nowrap">{content}</div>
      ) : (
        <motion.div
          className="flex whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 34, ease: "linear", repeat: Infinity }}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
}

