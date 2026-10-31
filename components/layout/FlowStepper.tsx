import Link from "next/link";
import { Check } from "lucide-react";
import type { RequirementId } from "@/types/api";
import { cn } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";

export type FlowStep = "needs" | "compare" | "results" | "checklist";

const STEPS: Array<{ id: FlowStep; label: string; path: string }> = [
  { id: "needs", label: "Your needs", path: "/needs" },
  { id: "compare", label: "Compare clinics", path: "/compare" },
  { id: "results", label: "Results", path: "/results" },
  { id: "checklist", label: "Checklist", path: "/checklist" },
];

/** Progress through the four-step journey. Past steps are links that keep your selections. */
export function FlowStepper({
  current,
  needs,
  clinicId,
}: {
  current: FlowStep;
  needs: readonly RequirementId[];
  clinicId?: string;
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Progress" className="no-print">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isDone = index < currentIndex;
          const reachable = index <= currentIndex || needs.length > 0;
          const href = hrefWithNeeds(step.path, needs, step.id === "checklist" ? { clinic: clinicId } : {});

          const marker = (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                isCurrent && "border-pumpkin-500 bg-pumpkin-500 text-night-900",
                isDone && "border-plum-600 bg-plum-600 text-white",
                !isCurrent && !isDone && "border-line-strong bg-white text-ink-muted",
              )}
              aria-hidden="true"
            >
              {isDone ? <Check className="size-4" strokeWidth={3} /> : index + 1}
            </span>
          );

          const label = (
            <span
              className={cn(
                "text-[0.95rem] font-bold",
                isCurrent ? "text-night-900" : "text-ink-muted",
                !isCurrent && "hidden md:inline",
              )}
            >
              {step.label}
              {isDone ? <span className="sr-only"> (completed)</span> : null}
            </span>
          );

          return (
            <li key={step.id} className="flex items-center gap-1.5 sm:gap-2">
              {reachable && !isCurrent ? (
                <Link
                  href={href}
                  className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-plum-100"
                >
                  {marker}
                  {label}
                  <span className="sr-only md:hidden">{step.label}</span>
                </Link>
              ) : (
                <span
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2"
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {marker}
                  {label}
                  {!isCurrent ? <span className="sr-only md:hidden">{step.label} (not available yet)</span> : null}
                </span>
              )}
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 w-4 rounded-full sm:w-8",
                    index < currentIndex ? "bg-plum-600" : "bg-line-strong",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="sr-only">
        Step {currentIndex + 1} of {STEPS.length}: {STEPS[currentIndex]?.label}
      </p>
    </nav>
  );
}

export function FlowStepperSkeleton() {
  return <div aria-hidden="true" className="h-10 w-full max-w-md animate-pulse rounded-full bg-plum-100/70" />;
}
