"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ClipboardList, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { FictionalDataNotice, FictionalTag } from "@/components/ui/FictionalDataNotice";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { CapabilityPill, MatchStatusBadge } from "@/components/ui/StatusBadge";
import { REQUIREMENT_IDS, type Clinic, type RequirementId } from "@/types/api";
import { cn, plural } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";
import { REQUIREMENTS, requirementLabel } from "@/utils/requirements";
import {
  CAPABILITY_STATUS_META,
  getMatchStatusMeta,
  TONES,
  type CapabilityDisplayStatus,
} from "@/utils/status";
import { useClinics, useMatch } from "@/utils/use-api";

const GROUPS: Array<{ status: CapabilityDisplayStatus; hint?: string }> = [
  { status: "CONFIRMED" },
  { status: "UNKNOWN", hint: "Ask the clinic to confirm" },
  { status: "UNAVAILABLE" },
  { status: "NOT_LISTED", hint: "Missing from the record" },
];

function capabilityOf(clinic: Clinic, id: RequirementId): CapabilityDisplayStatus {
  const value = (clinic.capabilities as Partial<Record<RequirementId, string>>)[id];
  return value === "CONFIRMED" || value === "UNAVAILABLE" || value === "UNKNOWN" ? value : "NOT_LISTED";
}

export function ClinicDetailView({ clinicId, needs }: { clinicId: string; needs: RequirementId[] }) {
  const { state, retry } = useClinics();

  if (state.status === "loading") {
    return (
      <>
        <h1 className="font-display text-4xl font-semibold text-night-900">Clinic details</h1>
        <LoadingState label="Loading this clinic's record…" rows={3} />
      </>
    );
  }
  if (state.status === "error") {
    return (
      <>
        <h1 className="font-display text-4xl font-semibold text-night-900">Clinic details</h1>
        <ErrorState title="We couldn't load this clinic" error={state.error} onRetry={retry} />
      </>
    );
  }

  const clinic = state.data.clinics.find((c) => c.id === clinicId);
  if (!clinic) {
    return (
      <EmptyState
        headingLevel={1}
        title="We couldn't find that clinic"
        actions={
          <ButtonLink href={hrefWithNeeds("/compare", needs)} icon={<ArrowLeft />} variant="secondary">
            Back to the comparison
          </ButtonLink>
        }
      >
        It may have been removed from the demonstration dataset, or the link is incomplete.
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <FictionalTag />
        <h1 className="font-display mt-3 text-[2.35rem] font-semibold leading-[1.08] text-night-900 sm:text-5xl">
          {clinic.name}
        </h1>
        {clinic.description ? (
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{clinic.description}</p>
        ) : null}
      </div>

      <FictionalDataNotice />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="record-title" className="rounded-[1.75rem] border border-line bg-white p-6 shadow-card sm:p-8">
          <h2 id="record-title" className="font-display text-2xl font-semibold text-night-900">
            Accessibility record
          </h2>
          <p className="mt-1 text-ink-soft">Every accommodation AccessReady tracks, grouped by status.</p>
          <div className="mt-6 flex flex-col gap-6">
            {GROUPS.map(({ status, hint }) => {
              const ids = REQUIREMENT_IDS.filter((id) => capabilityOf(clinic, id) === status);
              if (ids.length === 0) return null;
              const tone = TONES[CAPABILITY_STATUS_META[status].tone];
              return (
                <div key={status}>
                  <h3 className={cn("flex flex-wrap items-center gap-2 font-bold", tone.text)}>
                    <CapabilityPill status={status} compact />
                    {hint ? <span className="text-[0.95rem]">{hint}</span> : null}
                  </h3>
                  <ul className="mt-2 flex flex-col divide-y divide-line">
                    {ids.map((id) => {
                      const Icon = REQUIREMENTS[id].icon;
                      const isNeed = needs.includes(id);
                      return (
                        <li key={id} className="flex items-center gap-3 py-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-plum-100 text-plum-700">
                            <Icon aria-hidden="true" className="size-[1.1rem]" />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-bold text-night-900">{REQUIREMENTS[id].label}</span>
                            {isNeed ? (
                              <span className="inline-flex items-center gap-1 text-sm font-bold text-plum-700">
                                <Star aria-hidden="true" className="size-3.5 fill-current" />
                                Your need
                              </span>
                            ) : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {needs.length > 0 ? (
          <ClinicMatchPanel clinicId={clinic.id} clinicName={clinic.name} needs={needs} />
        ) : (
          <section aria-labelledby="match-cta-title" className="rounded-[1.75rem] border border-plum-200 bg-plum-50 p-6 sm:p-8">
            <h2 id="match-cta-title" className="font-display text-2xl font-semibold text-night-900">
              Is this clinic ready for you?
            </h2>
            <p className="mt-2 text-ink-soft">
              Choose your accessibility needs to get a compatibility verdict and a checklist of questions for this clinic.
            </p>
            <ButtonLink href="/needs" className="mt-5" trailingIcon={<ArrowRight />}>
              Choose my needs
            </ButtonLink>
          </section>
        )}
      </div>

      <div className="no-print flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={hrefWithNeeds("/compare", needs)} variant="secondary" icon={<ArrowLeft />}>
          Back to the comparison
        </ButtonLink>
        {needs.length > 0 ? (
          <ButtonLink href={hrefWithNeeds("/results", needs)} variant="ghost">
            All compatibility results
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}

function ClinicMatchPanel({
  clinicId,
  clinicName,
  needs,
}: {
  clinicId: string;
  clinicName: string;
  needs: RequirementId[];
}) {
  const { state, retry } = useMatch(needs);

  return (
    <section aria-labelledby="match-title" className="rounded-[1.75rem] border border-line bg-white p-6 shadow-card sm:p-8">
      <h2 id="match-title" className="font-display text-2xl font-semibold text-night-900">
        Your compatibility
      </h2>
      <div className="mt-4">
        {state.status === "loading" ? (
          <LoadingState label={`Checking ${plural(needs.length, "need")} at ${clinicName}…`} rows={2} className="shadow-none" />
        ) : state.status === "error" ? (
          <ErrorState title="We couldn't check compatibility" error={state.error} onRetry={retry} />
        ) : (
          (() => {
            const result = state.data.results.find((r) => r.clinicId === clinicId);
            if (!result) {
              return <p className="text-ink-soft">This clinic wasn&apos;t included in the compatibility results.</p>;
            }
            const meta = getMatchStatusMeta(result.status);
            return (
              <div className="flex flex-col gap-5">
                <p role="status" className="sr-only">
                  {clinicName}: {meta.label}.
                </p>
                <div className={cn("rounded-2xl border p-4", TONES[meta.tone].panel)}>
                  <MatchStatusBadge status={result.status} size="lg" className="bg-white" />
                  <p className={cn("mt-3 font-bold", TONES[meta.tone].text)}>{meta.headline}</p>
                  <p className="text-ink-soft">
                    {result.confirmedCount} confirmed · {result.unavailableCount} unavailable · {result.unknownCount} unknown
                  </p>
                </div>
                <ul className="flex flex-col divide-y divide-line">
                  {result.checks.map((check) => (
                    <li key={check.requirement} className="py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-night-900">{requirementLabel(check.requirement)}</span>
                        <CapabilityPill status={check.status} compact />
                      </div>
                      {check.explanation ? <p className="mt-1 text-[0.975rem] text-ink-soft">{check.explanation}</p> : null}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={hrefWithNeeds("/checklist", needs, { clinic: clinicId })}
                  variant="purple"
                  icon={<ClipboardList />}
                  className="self-start"
                >
                  Build my checklist
                  <span className="sr-only"> for {clinicName}</span>
                </ButtonLink>
                <Link href={hrefWithNeeds("/results", needs)} className="sr-only focus:not-sr-only">
                  Compare with other clinics
                </Link>
              </div>
            );
          })()
        )}
      </div>
    </section>
  );
}
