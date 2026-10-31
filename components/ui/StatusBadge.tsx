import { cn } from "@/utils/cn";
import { getCapabilityStatusMeta, getMatchStatusMeta, TONES } from "@/utils/status";

/** Overall clinic verdict: icon + text + color (never color alone). */
export function MatchStatusBadge({
  status,
  size = "md",
  className,
}: {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const meta = getMatchStatusMeta(status);
  const tone = TONES[meta.tone];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-bold forced-colors:border-[CanvasText]",
        tone.chip,
        size === "sm" && "px-2.5 py-0.5 text-sm",
        size === "md" && "px-3 py-1 text-[0.95rem]",
        size === "lg" && "gap-2 px-4 py-1.5 text-lg",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(tone.icon, size === "lg" ? "size-5" : "size-4", "shrink-0")}
        strokeWidth={2.4}
      />
      {meta.label}
    </span>
  );
}

/** Per-requirement capability status: icon + text + color. */
export function CapabilityPill({
  status,
  className,
  compact = false,
}: {
  status: string | undefined;
  className?: string;
  compact?: boolean;
}) {
  const meta = getCapabilityStatusMeta(status);
  const tone = TONES[meta.tone];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-bold forced-colors:border-[CanvasText]",
        tone.chip,
        compact ? "px-2 py-0.5 text-sm" : "px-2.5 py-1 text-[0.95rem]",
        className,
      )}
    >
      <Icon aria-hidden="true" className={cn("size-4 shrink-0", tone.icon)} strokeWidth={2.4} />
      {meta.label}
    </span>
  );
}
