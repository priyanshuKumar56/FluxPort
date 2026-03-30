"use client";

import React from "react";

export function FluxPortLandingBackground() {
  return (
    <>
      <style jsx global>{`
        .noise-layer {
          position: fixed;
          inset: 0;
          z-index: 998;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
          mix-blend-mode: overlay;
        }
        .grid-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: linear-gradient(rgba(99, 102, 241, 0.042) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.042) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 90% 70% at 50% 28%, black 0%, transparent 78%);
        }
        .line-clip {
          overflow: hidden;
        }
        .line-wrap {
          display: block;
        }
        ::selection {
          background: rgba(99, 102, 241, 0.28);
          color: #c7d2fe;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.28);
          border-radius: 4px;
        }
        html {
          scroll-behavior: auto; /* Lenis owns this */
        }

        /* Only hide the system cursor when our custom cursor is enabled. */
        .fluxport-custom-cursor-enabled body {
          cursor: none !important;
        }
        .fluxport-custom-cursor-enabled * {
          cursor: none !important;
        }
      `}</style>
      <div className="noise-layer" />
      <div className="grid-layer" />
    </>
  );
}

