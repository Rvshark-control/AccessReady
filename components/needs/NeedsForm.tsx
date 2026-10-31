"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { REQUIREMENT_IDS, type RequirementId } from "@/types/api";
import { cn, plural } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";
import { DEMO_REQUIREMENTS, orderRequirements, REQUIREMENTS } from "@/utils/requirements";

const CATEGORY_STYLES = {
  Mobility: "bg-plum-100 text-plum-800",
  Communication: "bg-pumpkin-100 text-pumpkin-800",
  Sensory: "bg-ready-50 text-ready-800",
} as const;

export function NeedsForm({ initialNeeds, demo }: { initialNeeds: RequirementId[]; demo: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<RequirementId[]>(initialNeeds);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const countId = useId();

  // Keep the URL in sync so reloads, sharing, and the Back button preserve the selection.
  useEffect(() => {
    window.history.replaceState(null, "", hrefWithNeeds("/needs", selected, { demo: demo ? "1" : undefined }));
  }, [selected, demo]);

  function toggle(id: RequirementId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : orderRequirements([...prev, id])));
    setError(null);
  }

  function loadDemo() {
    setSelected([...DEMO_REQUIREMENTS]);
    setError(null);
  }

  function clearAll() {
    setSelected([]);
    setError(null);
    firstInputRef.current?.focus();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected.length === 0) {
      setError("Choose at least one accessibility need to continue. We can't check a clinic against an empty list.");
      firstInputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    router.push(hrefWithNeeds("/compare", selected));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {demo ? (
        <div className="flex flex-col gap-4 rounded-3xl border border-plum-200 bg-plum-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-ink-soft">
            <Sparkles aria-hidden="true" className="mt-1 size-5 shrink-0 text-plum-700" />
            <span>
              <strong className="text-night-900">Demo profile loaded.</strong> Alex uses a power wheelchair and
              needs a fully assisted transfer to the exam table. We&apos;ve preselected four needs. Change anything,
              then continue.
            </span>
          </p>
        </div>
      ) : null}

      <fieldset aria-describedby={error ? `${errorId} ${countId}` : countId} className="min-w-0">
        <legend className="sr-only">Accessibility needs for your appointment</legend>

        {error ? (
          <div
            id={errorId}
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border-2 border-blocked-200 bg-blocked-50 px-4 py-3.5 font-bold text-blocked-800"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            {error}
          </div>
        ) : null}

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {REQUIREMENT_IDS.map((id, index) => (
            <li key={id} className="flex">
              <NeedCard
                id={id}
                checked={selected.includes(id)}
                onToggle={() => toggle(id)}
                inputRef={index === 0 ? firstInputRef : undefined}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p id={countId} role="status" className="text-lg font-bold text-night-900">
            {selected.length === 0
              ? "No needs selected yet"
              : `${plural(selected.length, "need")} selected`}
          </p>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-bold text-plum-700 underline-offset-4 hover:bg-plum-50 hover:underline"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Clear all
            </button>
          ) : (
            <button
              type="button"
              onClick={loadDemo}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-bold text-plum-700 underline-offset-4 hover:bg-plum-50 hover:underline"
            >
              <Sparkles aria-hidden="true" className="size-4" />
              Use the demo profile
            </button>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-plum-200 bg-white px-6 text-lg font-bold text-night-900 transition-colors hover:border-plum-500 hover:bg-plum-50"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            Back
          </Link>
          <Button type="submit" size="lg" trailingIcon={<ArrowRight />} disabled={submitting}>
            {submitting ? "Opening comparison…" : "Continue to clinic comparison"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function NeedCard({
  id,
  checked,
  onToggle,
  inputRef,
}: {
  id: RequirementId;
  checked: boolean;
  onToggle: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const meta = REQUIREMENTS[id];
  const Icon = meta.icon;
  const titleId = `need-${id}-title`;
  const descId = `need-${id}-desc`;

  return (
    <label
      className={cn(
        "group relative flex w-full cursor-pointer flex-col gap-4 rounded-3xl border-2 bg-white p-5 shadow-soft transition-[border-color,background-color,box-shadow,transform] duration-200 sm:p-6",
        "hover:border-plum-400 hover:shadow-card motion-safe:hover:-translate-y-0.5",
        "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-plum-600 has-[:focus-visible]:outline-solid",
        checked ? "border-plum-600 bg-plum-50 shadow-card" : "border-line",
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        name="needs"
        value={id}
        checked={checked}
        onChange={onToggle}
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="peer sr-only"
      />
      <span className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl transition-colors",
            checked ? "bg-plum-600 text-white" : "bg-plum-100 text-plum-700",
          )}
        >
          <Icon aria-hidden="true" className="size-7" strokeWidth={2} />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "flex size-8 items-center justify-center rounded-xl border-2 transition-colors forced-colors:border-[CanvasText]",
            checked ? "border-plum-600 bg-plum-600 text-white" : "border-plum-500 bg-white text-transparent",
          )}
        >
          <Check className={cn("size-5", checked && "motion-safe:animate-pop")} strokeWidth={3.2} />
        </span>
      </span>
      <span className="flex flex-col gap-1.5">
        <span id={titleId} className="text-xl font-bold leading-snug text-night-900">
          {meta.label}
        </span>
        <span id={descId} className="leading-relaxed text-ink-soft">
          {meta.description}
        </span>
      </span>
      <span className="mt-auto flex items-center justify-between gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 text-sm font-bold", CATEGORY_STYLES[meta.category])}>
          {meta.category}
        </span>
        <span
          aria-hidden="true"
          className={cn("text-sm font-bold", checked ? "text-plum-700" : "text-ink-muted")}
        >
          {checked ? "Selected" : "Not selected"}
        </span>
      </span>
    </label>
  );
}
