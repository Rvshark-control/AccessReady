import { GitCompareArrows, Equal } from "lucide-react";
import { CapabilityPill } from "@/components/ui/StatusBadge";
import type { ClinicMatchResult, RequirementId } from "@/types/api";
import { cn, formatList } from "@/utils/cn";
import { REQUIREMENTS } from "@/utils/requirements";
import { getCapabilityStatusMeta } from "@/utils/status";

function statusFor(result: ClinicMatchResult, id: RequirementId): string | undefined {
  return result.checks.find((c) => c.requirement === id)?.status;
}

/** "Confirmed at A and B. Unknown at C." built from the backend's per-need checks. */
function describeRow(results: ClinicMatchResult[], id: RequirementId): string {
  const groups = new Map<string, string[]>();
  for (const r of results) {
    const label = getCapabilityStatusMeta(statusFor(r, id)).label;
    groups.set(label, [...(groups.get(label) ?? []), r.clinicName]);
  }
  return [...groups.entries()].map(([label, names]) => `${label} at ${formatList(names)}.`).join(" ");
}

/** Shows, need by need, where the clinics agree and where they differ. */
export function DifferencesTable({
  results,
  needs,
}: {
  results: ClinicMatchResult[];
  needs: readonly RequirementId[];
}) {
  const rows = needs.map((id) => {
    const statuses = results.map((r) => statusFor(r, id) ?? "NOT_LISTED");
    return { id, differs: new Set(statuses).size > 1, sentence: describeRow(results, id) };
  });
  const differing = rows.filter((r) => r.differs).length;

  return (
    <section aria-labelledby="differences-title" id="differences" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="differences-title" className="font-display text-3xl font-semibold text-night-900">
            What differs between clinics
          </h2>
          <p className="mt-2 text-ink-soft">
            {results.length < 2
              ? "Only one clinic is in the demo dataset, so there's nothing to compare yet."
              : differing === 0
                ? "Every clinic has the same status for each of your needs."
                : `${differing} of your ${needs.length} needs ${differing === 1 ? "varies" : "vary"} between clinics. Those rows are where your choice of clinic matters most.`}
          </p>
        </div>
      </div>

      {/* Large screens: table */}
      <div className="hidden overflow-x-auto rounded-3xl border border-line bg-white shadow-card lg:block">
        <table className="w-full border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Status of each of your needs at every fictional clinic, with rows that differ marked.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[28%] border-b border-line bg-cream-100 px-5 py-4 text-sm font-bold uppercase tracking-wide text-ink-muted">
                Your need
              </th>
              {results.map((r) => (
                <th key={r.clinicId} scope="col" className="border-b border-l border-line bg-cream-100 px-4 py-4 font-bold leading-snug text-night-900">
                  {r.clinicName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const Icon = REQUIREMENTS[row.id].icon;
              return (
                <tr key={row.id} className={cn(row.differs && "bg-pumpkin-50/70")}>
                  <th scope="row" className={cn("border-b border-line px-5 py-4", row.differs && "border-l-4 border-l-pumpkin-500")}>
                    <span className="flex items-center gap-3">
                      <Icon aria-hidden="true" className="size-5 shrink-0 text-plum-700" />
                      <span className="flex flex-col">
                        <span className="font-bold text-night-900">{REQUIREMENTS[row.id].label}</span>
                        <DiffTag differs={row.differs} />
                      </span>
                    </span>
                  </th>
                  {results.map((r) => (
                    <td key={r.clinicId} className="border-b border-l border-line px-4 py-4">
                      <CapabilityPill status={statusFor(r, row.id)} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Small screens: plain-language rows */}
      <ul className="flex flex-col gap-3 lg:hidden">
        {rows.map((row) => {
          const Icon = REQUIREMENTS[row.id].icon;
          return (
            <li
              key={row.id}
              className={cn(
                "rounded-2xl border bg-white p-4 shadow-soft",
                row.differs ? "border-pumpkin-200 border-l-4 border-l-pumpkin-500" : "border-line",
              )}
            >
              <p className="flex items-center gap-2.5 font-bold text-night-900">
                <Icon aria-hidden="true" className="size-5 shrink-0 text-plum-700" />
                {REQUIREMENTS[row.id].label}
              </p>
              <DiffTag differs={row.differs} className="mt-1" />
              <p className="mt-2 text-[0.975rem] leading-relaxed text-ink-soft">{row.sentence}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function DiffTag({ differs, className }: { differs: boolean; className?: string }) {
  return differs ? (
    <span className={cn("inline-flex items-center gap-1 text-sm font-bold text-pumpkin-800", className)}>
      <GitCompareArrows aria-hidden="true" className="size-3.5" />
      Varies by clinic
    </span>
  ) : (
    <span className={cn("inline-flex items-center gap-1 text-sm font-bold text-ink-muted", className)}>
      <Equal aria-hidden="true" className="size-3.5" />
      Same at every clinic
    </span>
  );
}
