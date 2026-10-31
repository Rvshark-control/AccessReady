"use client";

import Link from "next/link";
import { ArrowLeft, ArrowDown, RotateCcw, ShieldAlert } from "lucide-react";
import { DifferencesTable } from "@/components/results/DifferencesTable";
import { ResultCard } from "@/components/results/ResultCard";
import { ButtonLink } from "@/components/ui/Button";
import { FictionalDataNotice } from "@/components/ui/FictionalDataNotice";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { MATCH_STATUSES, type ClinicMatchResult, type RequirementId } from "@/types/api";
import { cn, formatList, plural } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";
import { getMatchStatusMeta, MATCH_STATUS_META, TONES } from "@/utils/status";
import { useMatch } from "@/utils/use-api";

/** Display order only: ready first, then by number of confirmed needs. */
export function sortResults(results: ClinicMatchResult[]): ClinicMatchResult[] {
  return [...results].sort(
    (a, b) =>
      getMatchStatusMeta(a.status).rank - getMatchStatusMeta(b.status).rank ||
      b.confirmedCount - a.confirmedCount ||
      a.clinicName.localeCompare(b.clinicName),
  );
}

function headline(results: ClinicMatchResult[], needCount: number): string {
  const ready = results.filter((r) => r.status === "READY");
  const verify = results.filter((r) => r.status === "NEEDS_VERIFICATION");
  if (ready.length > 0) {
    return `${formatList(ready.map((r) => r.clinicName))} ${ready.length === 1 ? "has" : "have"} all ${plural(needCount, "need")} confirmed in the demo data.`;
  }
  if (verify.length > 0) {
    return `No clinic confirms all ${plural(needCount, "need")} yet, but ${plural(verify.length, "clinic")} ${verify.length === 1 ? "has" : "have"} no known barriers. Call ahead to verify.`;
  }
  return "Every clinic has a barrier or missing information for at least one of your needs.";
}

export function ResultsView({ needs }: { needs: RequirementId[] }) {
  const { state, retry } = useMatch(needs);

  if (state.status === "loading") {
    return <LoadingState label={`Checking ${plural(needs.length, "need")} against fictional clinic records…`} rows={4} />;
  }
  if (state.status === "error") {
    return <ErrorState title="We couldn't check compatibility" error={state.error} onRetry={retry} />;
  }

  const results = sortResults(state.data.results);

  if (results.length === 0) {
    return (
      <EmptyState
        title="No clinics to check"
        actions={
          <ButtonLink href={hrefWithNeeds("/needs", needs)} variant="secondary" icon={<ArrowLeft />}>
            Back to your needs
          </ButtonLink>
        }
      >
        The demonstration dataset didn&apos;t return any clinics. Please try again in a moment.
      </EmptyState>
    );
  }

  // Same order as the clinic cards: ready, needs verification, not ready, incomplete.
  const counts = [...MATCH_STATUSES]
    .sort((a, b) => MATCH_STATUS_META[a].rank - MATCH_STATUS_META[b].rank)
    .map((status) => ({ status, count: results.filter((r) => r.status === status).length }));
  const announcement = `Results ready for ${plural(results.length, "fictional clinic")}: ${counts
    .filter((c) => c.count > 0)
    .map((c) => `${c.count} ${MATCH_STATUS_META[c.status].label.toLowerCase()}`)
    .join(", ")}.`;

  return (
    <div className="flex flex-col gap-10">
      <p role="status" className="sr-only">
        {announcement}
      </p>

      <section aria-labelledby="overview-title" className="flex flex-col gap-5">
        <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-card sm:p-8">
          <h2 id="overview-title" className="text-sm font-bold uppercase tracking-wide text-ink-muted">
            At a glance
          </h2>
          <p className="font-display mt-2 text-2xl font-semibold leading-snug text-night-900 sm:text-[1.9rem]">
            {headline(results, needs.length)}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {counts.map(({ status, count }) => {
              const meta = MATCH_STATUS_META[status];
              const tone = TONES[meta.tone];
              const Icon = meta.icon;
              return (
                <li key={status} className={cn("rounded-2xl border p-4", count > 0 ? tone.panel : "border-line bg-cream-100/50")}>
                  <p className={cn("flex items-center gap-2 font-bold", count > 0 ? tone.text : "text-ink-muted")}>
                    <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.4} />
                    {meta.label}
                  </p>
                  <p className="mt-1 text-ink-soft">
                    <span className="font-display text-3xl font-semibold text-night-900">{count}</span>{" "}
                    {count === 1 ? "clinic" : "clinics"}
                  </p>
                </li>
              );
            })}
          </ul>
          <Link
            href="#differences"
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full font-bold text-wine-700 underline-offset-4 hover:underline"
          >
            <ArrowDown aria-hidden="true" className="size-4" />
            Jump to what differs between clinics
          </Link>
        </div>

        <div className="flex gap-3 rounded-2xl border border-wine-200 bg-wine-50 p-4 text-ink-soft">
          <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-wine-700" />
          <p>
            <strong className="text-night-900">“Ready” means confirmed in the demonstration dataset only.</strong> It
            does not guarantee real-world accessibility. Always confirm with the clinic before your visit.
          </p>
        </div>
        <FictionalDataNotice />
      </section>

      <section aria-labelledby="clinic-results-title" className="flex flex-col gap-5">
        <h2 id="clinic-results-title" className="font-display text-3xl font-semibold text-night-900">
          Clinic by clinic
        </h2>
        <ul className="grid gap-6 xl:grid-cols-2">
          {results.map((result) => (
            <li key={result.clinicId} className="flex flex-col [&>article]:flex-1">
              <ResultCard result={result} needs={needs} allResults={results} />
            </li>
          ))}
        </ul>
      </section>

      <DifferencesTable results={results} needs={needs} />

      <div className="no-print flex flex-col-reverse gap-3 rounded-3xl border border-line bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <ButtonLink href={hrefWithNeeds("/compare", needs)} variant="secondary" size="lg" icon={<ArrowLeft />}>
          Back to comparison
        </ButtonLink>
        <ButtonLink href="/needs" variant="ghost" size="lg" icon={<RotateCcw />}>
          Start a new check
        </ButtonLink>
      </div>
    </div>
  );
}
