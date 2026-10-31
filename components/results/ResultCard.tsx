import Link from "next/link";
import { ArrowRight, CircleCheck, CircleQuestionMark, CircleX, ClipboardList, Footprints } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { FictionalTag } from "@/components/ui/FictionalDataNotice";
import { CapabilityPill, MatchStatusBadge } from "@/components/ui/StatusBadge";
import type { ClinicMatchResult, RequirementId } from "@/types/api";
import { cn, formatList, plural } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";
import { isRequirementId, REQUIREMENTS, requirementLabel } from "@/utils/requirements";
import { getMatchStatusMeta, TONES } from "@/utils/status";

/** Status-specific, actionable guidance. Copy only; the status itself comes from the backend. */
export function nextStepsFor(
  result: ClinicMatchResult,
  alternatives: ClinicMatchResult[],
): string[] {
  const questions = result.verificationQuestions.length;
  const unavailable = result.checks
    .filter((c) => c.status === "UNAVAILABLE")
    .map((c) => requirementLabel(c.requirement).toLowerCase());
  const readyElsewhere = alternatives.filter((r) => r.status === "READY" && r.clinicId !== result.clinicId);
  const alternative =
    readyElsewhere.length > 0
      ? `${formatList(readyElsewhere.map((r) => r.clinicName))} ${readyElsewhere.length === 1 ? "has" : "have"} all of these needs confirmed in the demo data.`
      : "Compare the other clinics on this page for a better fit.";

  switch (result.status) {
    case "READY":
      return [
        "When you book, mention each accommodation you'll need so the clinic can have it ready.",
        "Ask the clinic to add your accommodations to your patient record.",
        "Reconfirm a day or two before your visit. Equipment and staffing can change.",
      ];
    case "NEEDS_VERIFICATION":
      return [
        questions > 0
          ? `Call or email the clinic before booking and ask the ${plural(questions, "question")} on your checklist.`
          : "Call or email the clinic before booking to confirm the needs marked unknown.",
        "Ask them to note the confirmed accommodations in your patient record.",
        "If they can't confirm everything, consider another clinic.",
      ];
    case "NOT_READY":
      return [
        unavailable.length > 0
          ? `Ask whether the clinic can arrange an alternative for: ${formatList(unavailable)}.`
          : "Ask the clinic how it can accommodate the needs listed as unavailable.",
        alternative,
        "Use your checklist to write down exactly what the clinic tells you.",
      ];
    case "INCOMPLETE":
      return [
        "Ask the clinic for its accessibility information before you book.",
        "Use the checklist questions to fill in what the record doesn't say.",
        "Consider a clinic with a more complete record.",
      ];
    default:
      return ["Contact the clinic directly to confirm your accommodations before your visit."];
  }
}

const COUNT_ITEMS = [
  { key: "confirmedCount", label: "Confirmed", icon: CircleCheck, tone: "ready" },
  { key: "unavailableCount", label: "Unavailable", icon: CircleX, tone: "blocked" },
  { key: "unknownCount", label: "Unknown", icon: CircleQuestionMark, tone: "verify" },
] as const;

export function ResultCard({
  result,
  needs,
  allResults,
}: {
  result: ClinicMatchResult;
  needs: readonly RequirementId[];
  allResults: ClinicMatchResult[];
}) {
  const meta = getMatchStatusMeta(result.status);
  const tone = TONES[meta.tone];
  const headingId = `result-${result.clinicId}`;
  const total = result.confirmedCount + result.unavailableCount + result.unknownCount;
  const steps = nextStepsFor(result, allResults);
  const checklistHref = hrefWithNeeds("/checklist", needs, { clinic: result.clinicId });

  return (
    <article
      aria-labelledby={headingId}
      className="flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card"
    >
      <header className={cn("border-b px-6 pb-5 pt-6", tone.panel)}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <FictionalTag />
            <h3 id={headingId} className="font-display mt-2 text-[1.75rem] font-semibold leading-tight text-night-900">
              {result.clinicName}
            </h3>
          </div>
          <MatchStatusBadge status={result.status} size="lg" className="bg-white" />
        </div>
        <p className={cn("mt-3 text-lg font-bold", tone.text)}>{meta.headline}</p>
        <p className="mt-0.5 text-ink-soft">{meta.summary}</p>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-6 py-6">
        <div>
          <h4 className="sr-only">Summary for {result.clinicName}</h4>
          <dl className="grid grid-cols-3 gap-2.5">
            {COUNT_ITEMS.map(({ key, label, icon: Icon, tone: t }) => (
              <div key={key} className={cn("rounded-2xl border px-3 py-3", TONES[t].panel)}>
                <dt className={cn("flex items-center gap-1.5 text-sm font-bold", TONES[t].text)}>
                  <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} />
                  {label}
                </dt>
                <dd className="font-display mt-1 text-3xl font-semibold text-night-900">{result[key]}</dd>
              </div>
            ))}
          </dl>
          {total > 0 ? (
            <div aria-hidden="true" className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-incomplete-100">
              <span className="bg-ready-600" style={{ width: `${(result.confirmedCount / total) * 100}%` }} />
              <span className="bg-verify-500" style={{ width: `${(result.unknownCount / total) * 100}%` }} />
              <span className="bg-blocked-500" style={{ width: `${(result.unavailableCount / total) * 100}%` }} />
            </div>
          ) : null}
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Your needs at this clinic</h4>
          <ul className="mt-2 divide-y divide-line">
            {result.checks.map((check) => {
              const Icon = isRequirementId(check.requirement) ? REQUIREMENTS[check.requirement].icon : null;
              return (
                <li key={check.requirement} className="flex gap-3 py-3.5">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-wine-100 text-wine-700">
                    {Icon ? <Icon aria-hidden="true" className="size-[1.1rem]" /> : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                      <p className="font-bold text-night-900">{requirementLabel(check.requirement)}</p>
                      <CapabilityPill status={check.status} compact />
                    </div>
                    {check.explanation ? (
                      <p className="mt-1 text-[0.975rem] leading-relaxed text-ink-soft">{check.explanation}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-wine-200 bg-wine-50 p-4">
          <h4 className="flex items-center gap-2 font-bold text-night-900">
            <Footprints aria-hidden="true" className="size-5 text-wine-700" />
            Next steps
          </h4>
          <ol className="mt-2 list-decimal space-y-1.5 pl-6 text-ink-soft marker:font-bold marker:text-wine-700">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <footer className="no-print flex flex-col gap-3 border-t border-line bg-cream-100/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <ButtonLink href={checklistHref} icon={<ClipboardList />}>
          Build checklist
          <span className="sr-only"> for {result.clinicName}</span>
        </ButtonLink>
        <Link
          href={hrefWithNeeds(`/clinics/${encodeURIComponent(result.clinicId)}`, needs)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-bold text-wine-700 underline-offset-4 hover:underline"
        >
          Clinic details
          <span className="sr-only"> for {result.clinicName}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </footer>
    </article>
  );
}
