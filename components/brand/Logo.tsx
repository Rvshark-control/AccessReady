import { cn } from "@/utils/cn";

/** Compact brand mark: Boo's silhouette in a witch hat, with a confirmed check. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false" className={cn("shrink-0", className)}>
      <rect width="48" height="48" rx="14" fill="#7a2036" />
      <path
        d="M12.5 38 V25 C12.5 18.5 17 14 23.5 14 C30 14 34.5 18.5 34.5 25 V38 C32.7 36.3 31 36.3 29.2 38 C27.4 39.7 25.7 39.7 23.9 38 C22.1 36.3 20.4 36.3 18.6 38 C16.8 39.7 14.6 39.7 12.5 38 Z"
        fill="#fff8f0"
      />
      <ellipse cx="19.6" cy="25.5" rx="2" ry="2.7" fill="#1f1a1c" />
      <ellipse cx="27.4" cy="25.5" rx="2" ry="2.7" fill="#1f1a1c" />
      <path d="M11 15.2 C17 12.6 30 12.6 36 15.2 C30 16.8 17 16.8 11 15.2 Z" fill="#edcad3" />
      <path d="M16.6 14.4 L22.5 2.5 C23.8 4.6 27.4 9.6 30.4 14.4 C25.8 15.2 21.2 15.2 16.6 14.4 Z" fill="#edcad3" />
      <path d="M17.6 12.6 C21.6 13.4 25.6 13.4 29.4 12.6 L28.4 11 C25 11.6 21.8 11.6 18.4 11 Z" fill="#ff8a2a" />
      <circle cx="36" cy="36" r="8" fill="#ffa152" stroke="#1f1a1c" strokeWidth="2" />
      <path d="M32.6 36.2 L35 38.5 L39.4 33.6" fill="none" stroke="#1f1a1c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-10" />
      <span
        className={cn(
          "font-display text-[1.4rem] font-semibold leading-none tracking-tight",
          onDark ? "text-cream" : "text-night-900",
        )}
      >
        Access<span className={onDark ? "text-wine-300" : "text-wine-600"}>Ready</span>
      </span>
    </span>
  );
}
