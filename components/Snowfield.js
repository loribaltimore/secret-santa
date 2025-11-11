"use client";
import { useMemo, useEffect, useState } from "react";

export default function Snowfield({
  count = 180,
  zIndex = 99999,
  fixed = true,
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [near, mid, far] = useMemo(() => {
    if (!mounted) return [[], [], []]; // avoid SSR randomness

    const rand = Math.random;
    const make = (n, layer) => {
      const arr = [];
      for (let i = 0; i < n; i++) {
        const left = rand() * 100; // vw
        const delay = -(rand() * 20); // start at different moments
        const swayDelay = rand() * 4;
        let size, dur, blur, sway, opacity;

        if (layer === "near") {
          size = 3 + rand() * 3; // 3–6px
          dur = 8 + rand() * 6; // 8–14s
          blur = rand() * 0.8;
          sway = 24 + rand() * 22; // px
          opacity = 0.7 + rand() * 0.25;
        } else if (layer === "mid") {
          size = 2 + rand() * 2;
          dur = 12 + rand() * 8; // 12–20s
          blur = 0.8 + rand() * 1.2;
          sway = 16 + rand() * 16;
          opacity = 0.55 + rand() * 0.25;
        } else {
          size = 1 + rand() * 1.5;
          dur = 18 + rand() * 12; // 18–30s
          blur = 1.5 + rand() * 1.5;
          sway = 8 + rand() * 12;
          opacity = 0.35 + rand() * 0.25;
        }

        arr.push({
          left,
          delay,
          swayDelay,
          size,
          dur,
          blur,
          sway,
          opacity,
          key: `${layer}-${i}`,
        });
      }
      return arr;
    };

    const nearN = Math.round(count * 0.4);
    const midN = Math.round(count * 0.35);
    const farN = Math.max(0, count - nearN - midN);
    return [make(nearN, "near"), make(midN, "mid"), make(farN, "far")];
  }, [count, mounted]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0`}
      style={{ zIndex }}
    >
      <Layer flakes={far} depth="far" />
      <Layer flakes={mid} depth="mid" />
      <Layer flakes={near} depth="near" />

      <style jsx>{`
        .snow-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          perspective: 800px;
        }
        .flake-wrap {
          position: absolute;
          top: -6vh; /* start just above the viewport */
          left: 0;
          will-change: transform;
        }
        .flake {
          display: block;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          /* one transform using both CSS variables so animations compose */
          transform: translate3d(var(--tx, 0), var(--ty, -10vh), 0);
          will-change: transform, filter;
          animation-name: fall, sway;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }

        /* depth hint by wrapping Z movement on the container */
        .near .flake-wrap {
          transform: translateZ(20px);
        }
        .mid .flake-wrap {
          transform: translateZ(0);
        }
        .far .flake-wrap {
          transform: translateZ(-20px);
        }

        /* Animate CSS vars, not transform directly */
        @keyframes fall {
          0% {
            --ty: -10vh;
          }
          100% {
            --ty: 110vh;
          }
        }
        @keyframes sway {
          0% {
            --tx: 0;
          }
          100% {
            --tx: var(--swayX, 24px);
          }
        }
      `}</style>
    </div>
  );
}

function Layer({ flakes, depth }) {
  return (
    <div className={`snow-layer ${depth}`}>
      {flakes.map((f) => (
        <span
          key={f.key}
          className="flake-wrap"
          style={{ left: `${f.left}vw` }}
        >
          <span
            className="flake"
            style={{
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              // combine drop-shadow + blur so flakes show on light backgrounds
              filter: `drop-shadow(0 0 2px rgba(0,0,0,0.15)) blur(${f.blur}px)`,
              animationDuration: `${f.dur}s, ${2.5 + f.sway / 10}s`,
              animationDelay: `${f.delay}s, ${f.swayDelay}s`,
              // sway distance for this flake
              ["--swayX"]: `${f.sway}px`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
