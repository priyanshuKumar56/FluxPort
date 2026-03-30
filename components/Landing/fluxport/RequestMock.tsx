"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./registerGsap";
import { Play } from "lucide-react";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
const MC: Record<(typeof METHODS)[number], string> = {
  GET: "#34d399",
  POST: "#818cf8",
  PUT: "#fbbf24",
  PATCH: "#f472b6",
  DELETE: "#f87171",
};

export function RequestMock() {
  const reduceMotion = useReducedMotion();
  const [method, setMethod] = useState<(typeof METHODS)[number]>("GET");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        }
      );
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const send = () => {
    setLoading(true);
    setResponse(null);
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false);
      setResponse(`{\n  "status": 200,\n  "data": [\n    { "id": 1, "name": "FluxPort" },\n    { "id": 2, "name": "Workspace" }\n  ],\n  "latency": "38ms"\n}`);
    }, 1100);
  };

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden border border-white/[.09] bg-[#0a0a13] shadow-[0_40px_100px_rgba(0,0,0,.75)]"
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[.06] bg-white/[.02]">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-white/20">FluxPort — api-workspace</span>
      </div>
      <div className="flex h-[420px]">
        {/* Sidebar */}
        <div className="w-44 border-r border-white/[.05] p-3 flex flex-col gap-0.5 shrink-0">
          {["Collections", "Environments", "History", "Schemas"].map((s, i) => (
            <div
              key={s}
              className={`px-3 py-2 rounded-lg text-[12px] transition-colors ${
                i === 0
                  ? "bg-indigo-600/[.15] text-indigo-300 border border-indigo-500/20"
                  : "text-white/25 hover:text-white/55 hover:bg-white/[.04]"
              }`}
            >
              {s}
            </div>
          ))}
          <div className="mt-4 px-3 text-[10px] text-white/18 uppercase tracking-widest font-semibold">Recent</div>
          {["/api/users", "/api/auth", "/graphql"].map((p) => (
            <div
              key={p}
              className="px-3 py-1.5 text-[11px] text-white/20 font-mono hover:text-white/45 truncate"
            >
              {p}
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* URL bar */}
          <div className="flex gap-2 p-3 border-b border-white/[.05]">
            <div className="relative shrink-0">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as (typeof METHODS)[number])}
                className="appearance-none bg-[#12121e] border border-white/[.09] rounded-lg px-3 py-2 text-[12px] font-mono font-bold pr-6 focus:outline-none focus:border-indigo-500/50 transition-colors"
                style={{ color: MC[method] }}
              >
                {METHODS.map((m) => (
                  <option key={m} value={m} style={{ color: MC[m] }}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/25 text-[9px]">
                ▼
              </div>
            </div>
            <input
              defaultValue="https://api.yourservice.com/v1/resources"
              className="flex-1 min-w-0 bg-[#12121e] border border-white/[.09] rounded-lg px-3 py-2 text-[12px] font-mono text-white/48 focus:outline-none focus:border-indigo-500/40 transition-colors"
            />
            <motion.button
              onClick={send}
              whileTap={{ scale: 0.94 }}
              whileHover={{
                boxShadow: "0 0 24px rgba(99,102,241,.6)",
              }}
              className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-[12px] font-semibold flex items-center gap-1.5 min-w-[70px] justify-center shadow-[0_0_14px_rgba(99,102,241,.35)]"
            >
              {loading ? (
                reduceMotion ? (
                  <span className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                  />
                )
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Send
                </>
              )}
            </motion.button>
          </div>
          {/* Tabs */}
          <div className="flex px-3 border-b border-white/[.05]">
            {["Params", "Headers", "Body", "Auth"].map((t, i) => (
              <button
                key={t}
                className={`px-4 py-2.5 text-[12px] border-b-2 transition-colors ${
                  i === 2 ? "border-indigo-500 text-indigo-300" : "border-transparent text-white/28 hover:text-white/55"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {/* Body */}
          <div className="flex-1 p-4 font-mono text-[12px] overflow-auto">
            <AnimatePresence mode="wait">
              {response ? (
                <motion.pre
                  key="r"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-emerald-400 whitespace-pre leading-[1.75]"
                >
                  {response}
                </motion.pre>
              ) : (
                <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/18 leading-[1.8]">
                  {`{\n  "query": "{ users { id name email } }",\n  "variables": {}\n}`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Status */}
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[.05] text-[11px]"
              >
                <span className="text-emerald-400 font-semibold">200 OK</span>
                <span className="text-white/25">38ms</span>
                <span className="text-white/25">1.2 kb</span>
                <div className="ml-auto">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] border border-emerald-500/20">
                    JSON
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

