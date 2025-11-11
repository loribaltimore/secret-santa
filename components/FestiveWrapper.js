// NO "use client" here

export function FestiveWrapper({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_0%_0%,#1a472a_0%,#0b1f16_40%,#0b1f16_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[url('https://images.unsplash.com/photo-1547818330-7aa6e8b0c3df?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
      {children}
    </div>
  );
}

export function RibbonHeader({ title, subtitle }) {
  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <div className="absolute inset-x-0 top-4 -z-10 h-8 bg-[linear-gradient(90deg,#7a1111,#b21e1e,#7a1111)] rounded" />
      <div className="inline-block rounded-full bg-[conic-gradient(from_180deg,#f9e7a3,#caa84a,#f9e7a3)] px-5 py-2 shadow-md ring-1 ring-[#8b6b1f]/30">
        <div className="text-xs tracking-widest text-[#5a4210]">
          HOLIDAY EDITION
        </div>
      </div>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-[#f8f4e7] drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
        {title}
      </h1>
      {subtitle ? <p className="mt-2 text-[#e8e2cf]/80">{subtitle}</p> : null}
    </div>
  );
}

export function GarlandDivider() {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="h-[2px] w-full max-w-2xl bg-gradient-to-r from-transparent via-[#1f3b2a] to-transparent" />
      <ul className="absolute flex gap-3">
        {[...Array(10)].map((_, i) => (
          <li
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: i % 2 === 0 ? "#ff1e38" : "#ffe27a",
              boxShadow: "0 0 6px rgba(255,255,180,0.9)",
              animation: `twinkle ${2.2 + (i % 3) * 0.3}s ease-in-out ${
                i * 0.12
              }s infinite`,
            }}
          />
        ))}
      </ul>
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.75;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-1px);
          }
        }
      `}</style>
    </div>
  );
}

export function CandyButton({ children, variant = "primary", ...props }) {
  const base =
    "rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-transform active:scale-[0.98] focus:outline-none focus:ring-2";
  const styles =
    variant === "primary"
      ? "text-white bg-[#1f5d2c] hover:bg-[#184b23] focus:ring-emerald-400"
      : "text-[#7a1111] bg-[repeating-linear-gradient(45deg,#fff,#fff_8px,#ffe9ec_8px,#ffe9ec_16px)] ring-1 ring-rose-200 hover:ring-rose-300 focus:ring-rose-300";
  return (
    <button className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  );
}

export function CandyWindow({ children }) {
  return (
    <div className="relative">
      <div className="absolute -inset-[3px] rounded-md bg-[conic-gradient(from_45deg,#fff_0_25%,#ff4d6d_0_50%)] [background-size:10px_10px] -z-10" />
      <div className="absolute inset-0 rounded-md ring-1 ring-[#caa84a]/40 pointer-events-none" />
      <div className="rounded-md overflow-hidden bg-white">{children}</div>
    </div>
  );
}
