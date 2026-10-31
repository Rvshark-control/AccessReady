import { CapabilityPill } from "@/components/ui/StatusBadge";
import { cn } from "@/utils/cn";
import { CAPABILITY_STATUS_META, type CapabilityDisplayStatus } from "@/utils/status";

const ORDER: CapabilityDisplayStatus[] = ["CONFIRMED", "UNKNOWN", "UNAVAILABLE", "NOT_LISTED"];

/** Explains what each per-need status means. */
export function CapabilityLegend({
  className,
  includeNotListed = false,
}: {
  className?: string;
  includeNotListed?: boolean;
}) {
  const items = includeNotListed ? ORDER : ORDER.filter((s) => s !== "NOT_LISTED");
  return (
    <div className={cn("rounded-2xl border border-line bg-white/80 px-4 py-3", className)}>
      <h2 className="sr-only">What the statuses mean</h2>
      <dl className="flex flex-wrap gap-x-5 gap-y-2">
        {items.map((status) => (
          <div key={status} className="flex items-center gap-2">
            <dt>
              <CapabilityPill status={status} compact />
            </dt>
            <dd className="text-sm text-ink-muted">{CAPABILITY_STATUS_META[status].description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
