import { FlaskConical } from "lucide-react";
import { cn } from "@/utils/cn";

/** Clear, persistent labeling that all clinic data is fictional. */
export function FictionalDataNotice({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside
      aria-label="About this data"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-pumpkin-200 bg-pumpkin-50 px-4 py-3 text-[0.975rem] text-pumpkin-800",
        className,
      )}
    >
      <FlaskConical aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <p>
        <strong className="font-bold">Fictional demonstration data.</strong>{" "}
        {children ??
          "Every clinic shown here is made up for this prototype. Statuses come from a synthetic dataset, not real facilities."}
      </p>
    </aside>
  );
}

/** Small inline tag for clinic cards. */
export function FictionalTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-pumpkin-200 bg-pumpkin-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-pumpkin-800",
        className,
      )}
    >
      <FlaskConical aria-hidden="true" className="size-3.5" />
      Fictional
    </span>
  );
}
