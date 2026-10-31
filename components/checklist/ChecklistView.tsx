"use client";

import { useId, useRef, useState } from "react";
import {
  ArrowLeft,
  CircleCheck,
  Copy,
  Download,
  Info,
  MessageCircleQuestionMark,
  PhoneCall,
  Printer,
  Send,
} from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { FrontDeskCard } from "@/components/checklist/FrontDeskCard";
import { sortResults } from "@/components/results/ResultsView";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FictionalDataNotice } from "@/components/ui/FictionalDataNotice";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { MatchStatusBadge } from "@/components/ui/StatusBadge";
import type { ClinicMatchResult, RequirementId } from "@/types/api";
import { buildChecklistText, buildCopyText, checklistFileName } from "@/utils/checklist";
import { cn, plural } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";
import { REQUIREMENTS, requirementLabel } from "@/utils/requirements";
import { useMatch } from "@/utils/use-api";

export function ChecklistView({ needs, initialClinicId }: { needs: RequirementId[]; initialClinicId?: string }) {
  const { state, retry } = useMatch(needs);
  const [clinicId, setClinicId] = useState(initialClinicId);

  if (state.status === "loading") {
    return <LoadingState label="Preparing your checklist…" rows={3} />;
  }
  if (state.status === "error") {
    return <ErrorState title="We couldn't prepare your checklist" error={state.error} onRetry={retry} />;
  }

  const results = sortResults(state.data.results);
  if (results.length === 0) {
    return (
      <EmptyState title="No clinics to build a checklist for">
        The demonstration dataset didn&apos;t return any clinics. Please try again in a moment.
      </EmptyState>
    );
  }

  const selected = results.find((r) => r.clinicId === clinicId) ?? results[0];

  function selectClinic(id: string) {
    setClinicId(id);
    window.history.replaceState(null, "", hrefWithNeeds("/checklist", needs, { clinic: id }));
  }

  return (
    <div className="flex flex-col gap-8">
      <ClinicPicker results={results} selectedId={selected.clinicId} onSelect={selectClinic} />
      {/* Remount per clinic so copy/download messages never refer to a different clinic. */}
      <ChecklistDocument key={selected.clinicId} result={selected} needs={needs} />
    </div>
  );
}

function ClinicPicker({
  results,
  selectedId,
  onSelect,
}: {
  results: ClinicMatchResult[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset className="no-print min-w-0">
      <legend className="text-lg font-bold text-night-900">Which clinic are you contacting?</legend>
      <p className="mt-1 text-ink-soft">Choose a clinic to see its questions. Use the arrow keys to switch.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {results.map((r) => {
          const checked = r.clinicId === selectedId;
          return (
            <label
              key={r.clinicId}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 bg-white p-4 shadow-soft transition-colors",
                "hover:border-plum-400 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-plum-600 has-[:focus-visible]:outline-solid",
                checked ? "border-plum-600 bg-plum-50" : "border-line",
              )}
            >
              <input
                type="radio"
                name="checklist-clinic"
                value={r.clinicId}
                checked={checked}
                onChange={() => onSelect(r.clinicId)}
                className="sr-only"
              />
              <span className="flex items-start justify-between gap-2">
                <span className="font-bold leading-snug text-night-900">{r.clinicName}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 forced-colors:border-[CanvasText]",
                    checked ? "border-plum-600" : "border-plum-500",
                  )}
                >
                  <span className={cn("size-2.5 rounded-full", checked ? "bg-plum-600" : "bg-transparent")} />
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-2">
                <MatchStatusBadge status={r.status} size="sm" />
                <span className="text-sm text-ink-muted">{plural(r.verificationQuestions.length, "question")}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ChecklistDocument({ result, needs }: { result: ClinicMatchResult; needs: RequirementId[] }) {
  const [message, setMessage] = useState("");
  const [manualText, setManualText] = useState<string | null>(null);
  const manualRef = useRef<HTMLTextAreaElement>(null);
  const manualId = useId();
  const questions = result.verificationQuestions;
  const confirmed = result.checks.filter((c) => c.status === "CONFIRMED");

  async function copyQuestions() {
    const text = buildCopyText(result, needs);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
      setManualText(null);
      setMessage(
        `Copied ${plural(questions.length, "question")} and ${plural(needs.length, "request")} for ${result.clinicName} to your clipboard.`,
      );
    } catch {
      setManualText(text);
      setMessage("Your browser blocked automatic copying. The text is selected in the box below. Press Control+C or Command+C to copy it.");
      requestAnimationFrame(() => {
        manualRef.current?.focus();
        manualRef.current?.select();
      });
    }
  }

  function download() {
    const text = buildChecklistText(result, needs, new Date());
    const fileName = checklistFileName(result.clinicName);
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setMessage(`Downloaded ${fileName}. It's a plain-text file saved to your device.`);
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-10">
      <article
        aria-labelledby="checklist-title"
        className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-lift print:border-0 print:shadow-none"
      >
        <header className="on-dark bg-night px-6 py-7 text-cream sm:px-8 print:bg-white print:text-black">
          <div className="flex items-center gap-3">
            <LogoMark className="size-9" />
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-pumpkin-400 print:text-black">
              Accommodation checklist
            </p>
          </div>
          <h2 id="checklist-title" className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Questions for {result.clinicName}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <MatchStatusBadge status={result.status} />
            <span className="text-plum-200 print:text-black">
              {result.confirmedCount} confirmed · {result.unavailableCount} unavailable · {result.unknownCount} unknown
            </span>
          </div>
        </header>

        <div className="flex flex-col gap-8 px-6 py-7 sm:px-8">
          <section aria-labelledby="checklist-needs">
            <h3 id="checklist-needs" className="text-sm font-bold uppercase tracking-wide text-ink-muted">
              My accessibility needs
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {needs.map((id) => {
                const Icon = REQUIREMENTS[id].icon;
                return (
                  <li key={id} className="inline-flex items-center gap-2 rounded-full border border-plum-200 bg-plum-50 px-3 py-1.5 text-[0.95rem] font-bold text-plum-800">
                    <Icon aria-hidden="true" className="size-4" />
                    {REQUIREMENTS[id].label}
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="checklist-questions">
            <h3 id="checklist-questions" className="flex items-center gap-2 text-xl font-bold text-night-900">
              <MessageCircleQuestionMark aria-hidden="true" className="size-6 text-plum-700" />
              Questions to ask the clinic
            </h3>
            {questions.length > 0 ? (
              <ol className="mt-4 flex flex-col gap-3">
                {questions.map((question, i) => (
                  <li key={`${i}-${question}`} className="flex gap-4 rounded-2xl border border-line bg-cream/60 p-4">
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pumpkin-500 font-bold text-night-900"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[1.05rem] leading-relaxed text-night-900">{question}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-4 rounded-2xl border border-ready-200 bg-ready-50 p-4 text-ready-800">
                <p className="font-bold">No open questions for this clinic in the demo data.</p>
                <p className="mt-1">
                  Everything you selected is confirmed in the record. Still mention your accommodations when you book,
                  because records can change.
                </p>
              </div>
            )}
          </section>

          {confirmed.length > 0 ? (
            <section aria-labelledby="checklist-confirmed">
              <h3 id="checklist-confirmed" className="flex items-center gap-2 text-xl font-bold text-night-900">
                <CircleCheck aria-hidden="true" className="size-6 text-ready-700" />
                Confirmed in the demo record
              </h3>
              <p className="mt-1 text-ink-soft">Mention these when you book so the clinic can have them ready.</p>
              <ul className="mt-3 flex flex-col gap-2">
                {confirmed.map((check) => (
                  <li key={check.requirement} className="flex items-center gap-2.5 font-bold text-night-900">
                    <CircleCheck aria-hidden="true" className="size-5 shrink-0 text-ready-700" />
                    {requirementLabel(check.requirement)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="rounded-2xl border border-line bg-cream-100/70 p-4 text-sm leading-relaxed text-ink-muted">
            Generated by the AccessReady prototype from fictional demonstration data. It does not guarantee
            real-world accessibility. AccessReady has not contacted this clinic or sent any message for you.
          </p>
        </div>
      </article>

      <FrontDeskCard clinicName={result.clinicName} needs={needs} />
      </div>

      <aside aria-labelledby="checklist-actions" className="no-print flex flex-col gap-4 lg:sticky lg:top-24">
        <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-card">
          <h2 id="checklist-actions" className="text-lg font-bold text-night-900">
            Take it with you
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="primary" icon={<Copy />} onClick={copyQuestions} className="w-full">
              Copy questions &amp; requests
            </Button>
            <Button variant="purple" icon={<Download />} onClick={download} className="w-full">
              Download as text file
            </Button>
            <Button variant="secondary" icon={<Printer />} onClick={() => window.print()} className="w-full">
              Print checklist
            </Button>
          </div>
          <p role="status" className="mt-4 min-h-6 text-[0.95rem] font-bold text-ready-800">
            {message}
          </p>
          {manualText !== null ? (
            <div className="mt-3">
              <label htmlFor={manualId} className="text-sm font-bold text-night-900">
                Checklist text to copy
              </label>
              <textarea
                id={manualId}
                ref={manualRef}
                readOnly
                value={manualText}
                rows={6}
                className="mt-1.5 w-full rounded-xl border-2 border-plum-300 bg-cream p-3 font-mono text-sm text-night-900"
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-plum-200 bg-plum-50 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-night-900">
            <PhoneCall aria-hidden="true" className="size-5 text-plum-700" />
            How to use this checklist
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink-soft marker:font-bold marker:text-plum-700">
            <li>Call, email, or message the clinic&apos;s front desk or accessibility coordinator.</li>
            <li>Ask each question and write down who answered and what they said.</li>
            <li>Ask them to add your accommodations to your patient record.</li>
          </ol>
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-white/80 p-3 text-sm font-bold text-night-900">
            <Send aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-plum-700" />
            Nothing has been sent. AccessReady never contacts clinics for you.
          </p>
        </div>

        <ButtonLink href={hrefWithNeeds("/results", needs)} variant="secondary" icon={<ArrowLeft />}>
          Back to results
        </ButtonLink>
        <p className="flex items-start gap-2 text-sm text-ink-muted">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Downloads are plain text, readable by any device or screen reader.
        </p>
      </aside>

      <div className="lg:col-span-2">
        <FictionalDataNotice />
      </div>
    </div>
  );
}
