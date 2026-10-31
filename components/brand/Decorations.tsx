import { cn } from "@/utils/cn";

/*
 * Subtle Halloween decorations. Every element here is purely decorative:
 * aria-hidden, low contrast, never behind body text, and only animated
 * when the user hasn't asked for reduced motion.
 */

function Bat({ className, flap = true }: { className?: string; flap?: boolean }) {
  return (
    <svg viewBox="0 0 64 28" width="64" height="28" className={className} aria-hidden="true" focusable="false">
      <g
        className={cn(flap && "motion-safe:animate-flutter")}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        fill="currentColor"
      >
        <path d="M32 10 C29 6 25 4 20 3 C21 6 20 8 17 9 C14 6 9 5 3 6 C7 9 9 13 9 17 C13 15 17 15 20 17 C22 14 26 13 29 15 C30 16 31 18 32 20 C33 18 34 16 35 15 C38 13 42 14 44 17 C47 15 51 15 55 17 C55 13 57 9 61 6 C55 5 50 6 47 9 C44 8 43 6 44 3 C39 4 35 6 32 10 Z" />
      </g>
    </svg>
  );
}

export function BatFlock({ className }: { className?: string }) {
  return (
    <div className={cn("text-wine-300", className)} aria-hidden="true">
      <Bat className="w-14" />
      <Bat className="ml-16 -mt-2 w-9 [animation-delay:120ms]" />
      <Bat className="ml-6 mt-1 w-7" />
    </div>
  );
}

/** A single bat drifting slowly across the hero. */
export function DriftingBat({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute left-0 text-wine-400/60 motion-safe:animate-drift motion-reduce:hidden", className)}
    >
      <Bat className="w-10" />
    </div>
  );
}

const STARS: Array<{ x: number; y: number; r: number; d: number }> = [
  { x: 6, y: 12, r: 1.6, d: 0 },
  { x: 14, y: 34, r: 1.1, d: 1.4 },
  { x: 22, y: 8, r: 1.3, d: 2.2 },
  { x: 31, y: 22, r: 0.9, d: 0.6 },
  { x: 41, y: 6, r: 1.4, d: 1.9 },
  { x: 47, y: 30, r: 1, d: 2.8 },
  { x: 56, y: 14, r: 1.7, d: 0.9 },
  { x: 63, y: 40, r: 0.9, d: 3.1 },
  { x: 71, y: 9, r: 1.2, d: 1.2 },
  { x: 79, y: 26, r: 1.5, d: 2.4 },
  { x: 86, y: 5, r: 1, d: 0.3 },
  { x: 93, y: 18, r: 1.4, d: 1.7 },
  { x: 9, y: 58, r: 1, d: 2.6 },
  { x: 36, y: 52, r: 1.2, d: 0.4 },
  { x: 88, y: 48, r: 1.1, d: 3.3 },
  { x: 97, y: 64, r: 0.9, d: 1.1 },
];

export function StarField({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 100 70"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.22}
          fill="currentColor"
          className="motion-safe:animate-twinkle"
          style={{ animationDelay: `${s.d}s`, transformBox: "fill-box", transformOrigin: "center" }}
          opacity={0.7}
        />
      ))}
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M12 1.5 L14.1 9.9 L22.5 12 L14.1 14.1 L12 22.5 L9.9 14.1 L1.5 12 L9.9 9.9 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Cobweb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M0 0 L120 120" />
        <path d="M0 0 L60 120" />
        <path d="M0 0 L120 60" />
        <path d="M0 0 L22 120" />
        <path d="M0 0 L120 22" />
        <path d="M18 6 Q16 15 6 18" />
        <path d="M40 13 Q30 22 33 33 Q22 30 13 40" />
        <path d="M66 22 Q50 38 55 55 Q38 50 22 66" />
        <path d="M94 31 Q72 52 78 78 Q52 72 31 94" />
      </g>
    </svg>
  );
}

/** The scalloped "ghost sheet" edge that separates the hero from the page. */
export function GhostHem({ className, fill = "var(--color-cream)" }: { className?: string; fill?: string }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      width="100%"
      height="56"
      preserveAspectRatio="none"
      className={cn("block h-10 w-full sm:h-14", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 64 V40 C60 40 60 8 120 8 C180 8 180 40 240 40 C300 40 300 8 360 8 C420 8 420 40 480 40 C540 40 540 8 600 8 C660 8 660 40 720 40 C780 40 780 8 840 8 C900 8 900 40 960 40 C1020 40 1020 8 1080 8 C1140 8 1140 40 1200 40 C1260 40 1260 8 1320 8 C1380 8 1380 40 1440 40 V64 Z"
        fill={fill}
      />
    </svg>
  );
}
