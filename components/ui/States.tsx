"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Boo } from "@/components/brand/Boo";
import { Button } from "@/components/ui/Button";
import type { ApiError } from "@/utils/api-client";
import { cn } from "@/utils/cn";

/** Announced loading state with a calm skeleton. */
export function LoadingState({
  label,
  rows = 3,
  className,
}: {
  label: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div role="status" className={cn("rounded-3xl border border-line bg-white/70 p-6 shadow-soft", className)}>
      <div className="flex items-center gap-3 text-ink-soft">
        <span
          aria-hidden="true"
          className="size-5 rounded-full border-[3px] border-wine-200 border-t-wine-600 motion-safe:animate-spin"
        />
        <span className="font-bold">{label}</span>
      </div>
      <div aria-hidden="true" className="mt-6 space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="size-11 shrink-0 rounded-2xl bg-wine-100 motion-safe:animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-2/5 rounded-full bg-wine-100 motion-safe:animate-pulse" />
              <div className="h-3 w-4/5 rounded-full bg-wine-50 motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Clear error with a retry action. Moves focus to itself so keyboard and screen-reader users notice. */
export function ErrorState({
  title,
  error,
  onRetry,
  className,
}: {
  title: string;
  error: ApiError;
  onRetry?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className={cn(
        "rounded-3xl border-2 border-blocked-200 bg-white p-6 shadow-soft outline-none focus-visible:outline-3 sm:p-8",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blocked-50 text-blocked-700">
          <TriangleAlert aria-hidden="true" className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-night-900">{title}</h2>
          <p className="mt-1.5 text-ink-soft">{error.message}</p>
          {onRetry ? (
            <Button className="mt-5" variant="dark" icon={<RotateCcw />} onClick={onRetry}>
              Try again
            </Button>
          ) : null}
          <details className="mt-5 text-sm text-ink-muted">
            <summary className="cursor-pointer rounded font-bold text-ink-soft">Technical details</summary>
            <p className="mt-2 break-words font-mono text-[0.8rem]">{error.detail}</p>
          </details>
        </div>
      </div>
    </div>
  );
}

/** Friendly empty state with Boo. */
export function EmptyState({
  title,
  children,
  actions,
  headingLevel = 2,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  headingLevel?: 1 | 2;
  className?: string;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 rounded-[2rem] border border-line bg-white px-6 py-12 text-center shadow-soft sm:flex-row sm:px-12 sm:text-left",
        className,
      )}
    >
      <div className="w-36 shrink-0 sm:w-44">
        <Boo decorative />
      </div>
      <div className="max-w-xl">
        <Heading className="font-display text-3xl font-semibold text-night-900">{title}</Heading>
        {children ? <div className="mt-3 text-lg leading-relaxed text-ink-soft">{children}</div> : null}
        {actions ? <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">{actions}</div> : null}
      </div>
    </div>
  );
}
