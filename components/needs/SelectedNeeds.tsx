import Link from "next/link";
import { Pencil } from "lucide-react";
import type { RequirementId } from "@/types/api";
import { cn, plural } from "@/utils/cn";
import { hrefWithNeeds } from "@/utils/needs-param";
import { REQUIREMENTS } from "@/utils/requirements";

/** The patient's current selections as chips, with a link back to edit them. */
export function SelectedNeeds({
  needs,
  className,
}: {
  needs: readonly RequirementId[];
  className?: string;
}) {
  return (
    <section
      aria-labelledby="selected-needs-title"
      className={cn("rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-6", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="selected-needs-title" className="text-base font-bold text-night-900">
          Checking {plural(needs.length, "need")}
        </h2>
        <Link
          href={hrefWithNeeds("/needs", needs)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-bold text-wine-700 underline-offset-4 hover:bg-wine-50 hover:underline"
        >
          <Pencil aria-hidden="true" className="size-4" />
          Edit needs
        </Link>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {needs.map((id) => {
          const meta = REQUIREMENTS[id];
          const Icon = meta.icon;
          return (
            <li
              key={id}
              className="inline-flex items-center gap-2 rounded-full border border-wine-200 bg-wine-50 py-1.5 pl-2 pr-3.5 text-[0.95rem] font-bold text-wine-800"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-white text-wine-700">
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
              {meta.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
