"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, ClipboardList, Star } from "lucide-react";
import { CapabilityLegend } from "@/components/clinics/CapabilityLegend";
import { ButtonLink } from "@/components/ui/Button";
import { FictionalDataNotice, FictionalTag } from "@/components/ui/FictionalDataNotice";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { CapabilityPill } from "@/components/ui/StatusBadge";
import { REQUIREMENT_IDS, type Clinic, type RequirementId } from "@/types/api";
import { cn, plural } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";
import { REQUIREMENTS } from "@/utils/requirements";
import { getCapabilityStatusMeta, TONES, type CapabilityDisplayStatus } from "@/utils/status";
import { useClinics } from "@/utils/use-api";

/** Selected needs first (in canonical order), then everything else. */
function rowOrder(needs: readonly RequirementId[]): RequirementId[] {
  return [...needs, ...REQUIREMENT_IDS.filter((id) => !needs.includes(id))];
}

function capabilityOf(clinic: Clinic, id: RequirementId): CapabilityDisplayStatus {
  const value = (clinic.capabilities as Partial<Record<RequirementId, string>>)[id];
  return value === "CONFIRMED" || value === "UNAVAILABLE" || value === "UNKNOWN" ? value : "NOT_LISTED";
}

export function CompareView({ needs }: { needs: RequirementId[] }) {
  const { state, retry } = useClinics();

  if (state.status === "loading") {
    return <LoadingState label="Loading fictional clinic records…" rows={4} />;
  }
  if (state.status === "error") {
    return <ErrorState title="We couldn't load the clinics" error={state.error} onRetry={retry} />;
  }

  const { clinics } = state.data;

  if (clinics.length === 0) {
    return (
      <EmptyState
        title="No clinics to compare yet"
        actions={
          <ButtonLink href={hrefWithNeeds("/needs", needs)} variant="secondary" icon={<ArrowLeft />}>
            Back to your needs
          </ButtonLink>
        }
      >
        The demonstration dataset doesn&apos;t include any clinics right now. Please check back in a moment.
      </EmptyState>
    );
  }

  const rows = rowOrder(needs);

  return (
    <div className="flex flex-col gap-8">
      <p role="status" className="sr-only">
        Loaded {plural(clinics.length, "fictional clinic")}.
      </p>

      <FictionalDataNotice />

      {needs.length === 0 ? (
        <div className="flex flex-col gap-4 rounded-3xl border border-plum-200 bg-plum-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-soft">
            <strong className="text-night-900">You&apos;re viewing every accommodation.</strong> Choose your needs to
            highlight what matters to you and get a compatibility verdict for each clinic.
          </p>
          <ButtonLink href="/needs" variant="purple" trailingIcon={<ArrowRight />} className="shrink-0">
            Choose my needs
          </ButtonLink>
        </div>
      ) : null}

      <section aria-labelledby="matrix-title" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="matrix-title" className="font-display text-3xl font-semibold text-night-900">
            {plural(clinics.length, "fictional clinic")}, side by side
          </h2>
        </div>
        <CapabilityLegend includeNotListed={clinics.some((c) => rows.some((r) => capabilityOf(c, r) === "NOT_LISTED"))} />

        {/* Desktop: true comparison table */}
        <div className="hidden overflow-x-auto rounded-3xl border border-line bg-white shadow-card lg:block">
          <table className="w-full border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Accessibility capabilities of each fictional clinic.{" "}
              {needs.length > 0 ? "Your selected needs are listed first." : ""}
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-[26%] border-b border-line bg-cream-100 px-5 py-4 align-bottom text-sm font-bold uppercase tracking-wide text-ink-muted">
                  Accommodation
                </th>
                {clinics.map((clinic) => (
                  <th key={clinic.id} scope="col" className="border-b border-l border-line bg-cream-100 px-4 py-4 align-bottom">
                    <span className="flex flex-col items-start gap-1.5">
                      <FictionalTag />
                      <Link
                        href={hrefWithNeeds(`/clinics/${encodeURIComponent(clinic.id)}`, needs)}
                        className="group inline-flex items-start gap-1 rounded text-[1.05rem] font-bold leading-snug text-night-900 underline-offset-4 hover:text-plum-700 hover:underline"
                      >
                        {clinic.name}
                        <ChevronRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" />
                        <span className="sr-only">: view details</span>
                      </Link>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((id, index) => {
                const meta = REQUIREMENTS[id];
                const Icon = meta.icon;
                const isNeed = needs.includes(id);
                const showDivider = needs.length > 0 && index === needs.length && index < rows.length;
                return (
                  <Fragment key={id}>
                  {showDivider ? (
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={clinics.length + 1}
                        className="border-b border-line bg-cream px-5 pb-2 pt-5 text-left text-sm font-bold uppercase tracking-wide text-ink-muted"
                      >
                        Other accommodations
                      </th>
                    </tr>
                  ) : null}
                  <tr className={cn(isNeed && "bg-plum-50/70")}>
                    <th scope="row" className={cn("border-b border-line px-5 py-4 align-middle", isNeed && "border-l-4 border-l-plum-600")}>
                      <span className="flex items-center gap-3">
                        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", isNeed ? "bg-plum-600 text-white" : "bg-plum-100 text-plum-700")}>
                          <Icon aria-hidden="true" className="size-5" />
                        </span>
                        <span className="flex flex-col">
                          <span className="font-bold text-night-900">{meta.label}</span>
                          {isNeed ? (
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-plum-700">
                              <Star aria-hidden="true" className="size-3.5 fill-current" />
                              Your need
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </th>
                    {clinics.map((clinic) => (
                      <td key={clinic.id} className="border-b border-l border-line px-4 py-4 align-middle">
                        <CapabilityPill status={capabilityOf(clinic, id)} />
                      </td>
                    ))}
                  </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Clinic cards: full detail on small screens, a profile summary on desktop */}
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {clinics.map((clinic) => (
            <li key={clinic.id} className="flex">
              <ClinicCard clinic={clinic} rows={rows} needs={needs} />
            </li>
          ))}
        </ul>
      </section>

      <div className="no-print flex flex-col-reverse gap-3 rounded-3xl border border-line bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <ButtonLink href={hrefWithNeeds("/needs", needs)} variant="secondary" size="lg" icon={<ArrowLeft />}>
          Back to your needs
        </ButtonLink>
        {needs.length > 0 ? (
          <ButtonLink href={hrefWithNeeds("/results", needs)} size="lg" trailingIcon={<ArrowRight />}>
            Check compatibility for my {plural(needs.length, "need")}
          </ButtonLink>
        ) : (
          <ButtonLink href="/needs" size="lg" icon={<ClipboardList />}>
            Choose my needs first
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

function ClinicCard({
  clinic,
  rows,
  needs,
}: {
  clinic: Clinic;
  rows: RequirementId[];
  needs: readonly RequirementId[];
}) {
  const statuses = rows.map((id) => capabilityOf(clinic, id));
  const counts = {
    CONFIRMED: statuses.filter((s) => s === "CONFIRMED").length,
    UNKNOWN: statuses.filter((s) => s === "UNKNOWN").length,
    UNAVAILABLE: statuses.filter((s) => s === "UNAVAILABLE").length,
    NOT_LISTED: statuses.filter((s) => s === "NOT_LISTED").length,
  };
  const headingId = `clinic-${clinic.id}-name`;

  return (
    <article
      aria-labelledby={headingId}
      className="flex w-full flex-col rounded-3xl border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={headingId} className="font-display text-2xl font-semibold leading-tight text-night-900">
          {clinic.name}
        </h3>
        <FictionalTag className="mt-1 shrink-0" />
      </div>
      {clinic.description ? <p className="mt-2 leading-relaxed text-ink-soft">{clinic.description}</p> : null}

      <div className="mt-5">
        <p className="text-sm font-bold text-night-900">
          Record summary: {counts.CONFIRMED} of {rows.length} accommodations confirmed
        </p>
        <div aria-hidden="true" className="mt-2 flex h-2.5 gap-1">
          {statuses.map((status, i) => (
            <span
              key={i}
              className={cn("flex-1 rounded-full", TONES[getCapabilityStatusMeta(status).tone].fill)}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {counts.CONFIRMED} confirmed · {counts.UNKNOWN} unknown · {counts.UNAVAILABLE} unavailable
          {counts.NOT_LISTED > 0 ? ` · ${counts.NOT_LISTED} not listed` : ""}
        </p>
      </div>

      {/* Per-need detail: the table already shows this on large screens */}
      <ul className="mt-5 flex flex-col divide-y divide-line border-t border-line lg:hidden" aria-label={`${clinic.name} accommodations`}>
        {rows.map((id) => {
          const isNeed = needs.includes(id);
          return (
            <li key={id} className="flex items-center justify-between gap-3 py-3">
              <span className="flex flex-col">
                <span className={cn("font-bold", isNeed ? "text-night-900" : "text-ink-soft")}>
                  {REQUIREMENTS[id].shortLabel}
                </span>
                {isNeed ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-plum-700">
                    <Star aria-hidden="true" className="size-3.5 fill-current" />
                    Your need
                  </span>
                ) : null}
              </span>
              <CapabilityPill status={capabilityOf(clinic, id)} compact />
            </li>
          );
        })}
      </ul>

      <Link
        href={hrefWithNeeds(`/clinics/${encodeURIComponent(clinic.id)}`, needs)}
        className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start rounded-full pt-5 font-bold text-plum-700 underline-offset-4 hover:underline"
      >
        View clinic details
        <span className="sr-only">for {clinic.name}</span>
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}
