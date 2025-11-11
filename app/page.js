"use client";

import { useMemo, useRef, useState } from "react";
import Snowfall from "react-snowfall";
import {
  FestiveWrapper,
  RibbonHeader,
  GarlandDivider,
  CandyButton,
  CandyWindow,
} from "@/components/FestiveWrapper";

// --- data (unchanged) ---
const PEOPLE = ["Ellie", "Dakota", "Brian", "Manny", "Tina"];

const ASSIGNMENTS = {
  Ellie: "Manny",
  Dakota: "Brian",
  Brian: "Tina",
  Manny: "Dakota",
  Tina: "Ellie",
};

// --- motion / wheel constants (unchanged) ---
const EASING = "cubic-bezier(0.18, 0.6, 0.2, 1)";
const ROW_H = 48; // must match h-12
const BASE_CYCLES = 8;

export default function SecretSantaPage() {
  // state (unchanged)
  const [giver, setGiver] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  // visual wheel state (unchanged)
  const [offset, setOffset] = useState(0);
  const [duration, setDuration] = useState(0.0);
  const [rolling, setRolling] = useState(false);
  const listRef = useRef(null);

  // long virtual list (unchanged)
  const ROLLER = useMemo(() => {
    const copies = 40;
    const long = [];
    for (let i = 0; i < copies; i++) long.push(...PEOPLE);
    return long;
  }, []);

  function findTargetName(forGiver) {
    if (ASSIGNMENTS[forGiver]) return ASSIGNMENTS[forGiver];
    const pool = PEOPLE.filter((p) => p !== forGiver);
    return pool[Math.floor(Math.random() * pool.length)] || PEOPLE[0];
  }

  async function spin() {
    if (!giver) {
      alert("Select your name first.");
      return;
    }
    if (isSpinning) return;

    // try server lock (unchanged)
    let spun;
    try {
      const response = await fetch("/api/spin", {
        method: "POST",
        body: JSON.stringify({ giver }),
      });
      if (response.ok) {
        const data = await response.json();
        spun = data.hasSpun;
        if (spun) {
          setRecipient(ASSIGNMENTS[giver]);
          alert(`${giver}, you spun and the results are written in stone!`);
          return;
        }
      }
    } catch {
      alert("Tell Dakota this isn't working!");
    }

    const targetName = findTargetName(giver);
    const posInCycle = Math.max(0, PEOPLE.indexOf(targetName));
    const extraCycles = Math.floor(Math.random() * 3); // 0–2
    const cycles = BASE_CYCLES + extraCycles;
    const targetIndex = cycles * PEOPLE.length + posInCycle;
    const targetOffset = -(targetIndex * ROW_H);

    setIsSpinning(true);
    setRolling(true);

    const approxRows = cycles * PEOPLE.length;
    setDuration(2.2 + Math.min(1.8, approxRows / 60));

    requestAnimationFrame(() => setOffset(targetOffset));

    const node = listRef.current;
    if (node) {
      const onEnd = () => {
        setRolling(false);
        setIsSpinning(false);
        node.removeEventListener("transitionend", onEnd);
        setRecipient(targetName);
      };
      node.addEventListener("transitionend", onEnd);
    }
  }

  return (
    <FestiveWrapper>
      {/* gentle snowfall over everything */}
      <div className="pointer-events-none fixed inset-0 z-[5]">
        <Snowfall snowflakeCount={80} style={{ position: "fixed" }} />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <RibbonHeader
          title="Secret Santa"
          subtitle="Pick your name, spin the wheel, and see your recipient."
        />

        <GarlandDivider />

        {/* Controls Card */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-emerald-900/30 bg-white/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-black">
                Your name
              </label>
              <div className="relative">
                <select
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  value={giver}
                  onChange={(e) => {
                    setGiver(e.target.value);
                    setRecipient("");
                    // reset wheel position when changing names
                    setOffset(0);
                    setDuration(0);
                    setRolling(false);
                  }}
                >
                  <option value="">Select…</option>
                  {PEOPLE.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute -right-2 -top-2 rotate-12 text-xs">
                  🎄
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <CandyButton
                onClick={spin}
                disabled={!giver || isSpinning}
                aria-label="Spin the wheel"
              >
                {isSpinning ? "Spinning…" : "Spin Wheel"}
              </CandyButton>
              <CandyButton
                variant="secondary"
                onClick={() => {
                  setRecipient("");
                  setOffset(0);
                  setDuration(0);
                  setRolling(false);
                }}
              >
                Reset
              </CandyButton>
            </div>
          </div>
        </div>

        {/* Wheel Card */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-emerald-900/30 bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur">
          <div className="mb-3 text-sm text-black">Drawing</div>

          <CandyWindow>
            <div className="relative mx-auto w-full max-w-md">
              {/* highlight band */}
              <div className="pointer-events-none absolute inset-0 grid grid-rows-[1fr_48px_1fr]">
                <div className="bg-gradient-to-b from-white/85 to-transparent" />
                <div className="rounded-md ring-1 ring-neutral-300" />
                <div className="bg-gradient-to-t from-white/85 to-transparent" />
              </div>

              {/* viewport (48px = one row) */}
              <div
                className="relative h-12 overflow-hidden rounded-md bg-white"
                style={{ border: "1px solid rgba(0,0,0,0.08)" }}
              >
                <ul
                  ref={listRef}
                  className={`will-change-transform ${
                    rolling ? "opacity-95 blur-[0.15px]" : ""
                  }`}
                  style={{
                    transform: `translateY(${offset}px)`,
                    transitionProperty: "transform",
                    transitionDuration: `${duration}s`,
                    transitionTimingFunction: EASING,
                  }}
                >
                  {ROLLER.map((name, idx) => (
                    <li
                      key={`${name}-${idx}`}
                      className="h-12 px-3 text-center text-sm leading-[48px]"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CandyWindow>

          {/* Result */}
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wide text-black">
              Your recipient
            </div>
            <div className="mt-1 text-lg font-semibold text-emerald-900">
              {recipient || "—"}
            </div>
          </div>
        </div>
      </main>
    </FestiveWrapper>
  );
}
