import type { Metadata } from "next";
import { Suspense } from "react";
import { Boo } from "@/components/brand/Boo";
import { FlowStepper, FlowStepperSkeleton } from "@/components/layout/FlowStepper";
import { FlowPage, PageIntro } from "@/components/layout/PageIntro";
import { NeedsForm } from "@/components/needs/NeedsForm";
import { firstParam, parseNeeds, serializeNeeds } from "@/utils/needs-param";
import { DEMO_REQUIREMENTS } from "@/utils/requirements";

export const metadata: Metadata = {
  title: "Your accessibility needs",
  description: "Choose the accommodations you need for your medical appointment.",
};

type SearchParams = PageProps<"/needs">["searchParams"];

export default function NeedsPage({ searchParams }: PageProps<"/needs">) {
  return (
    <FlowPage>
      <Suspense fallback={<FlowStepperSkeleton />}>
        <StepperFromParams searchParams={searchParams} />
      </Suspense>

      <PageIntro
        eyebrow="Step 1 of 4 · Accessibility profile"
        title="What do you need at your appointment?"
        description="Select every accommodation that matters for this visit. We'll check each one against fictional clinic records, then show you what's confirmed, what's missing, and what to ask."
        aside={<Boo decorative className="w-40" />}
      />

      <Suspense fallback={<NeedsFormSkeleton />}>
        <NeedsFormFromParams searchParams={searchParams} />
      </Suspense>
    </FlowPage>
  );
}

async function resolveNeeds(searchParams: SearchParams) {
  const params = await searchParams;
  const demo = firstParam(params.demo) === "1";
  const fromUrl = parseNeeds(params.needs);
  // Explicit selections in the URL win; the demo flag only pre-fills an empty selection.
  const needs = fromUrl.length > 0 ? fromUrl : demo ? [...DEMO_REQUIREMENTS] : [];
  return { needs, demo };
}

async function StepperFromParams({ searchParams }: { searchParams: SearchParams }) {
  const { needs } = await resolveNeeds(searchParams);
  return <FlowStepper current="needs" needs={needs} />;
}

async function NeedsFormFromParams({ searchParams }: { searchParams: SearchParams }) {
  const { needs, demo } = await resolveNeeds(searchParams);
  // Remount when the URL's selection changes (Next.js preserves client state across navigations).
  return <NeedsForm key={`${serializeNeeds(needs)}|${demo}`} initialNeeds={needs} demo={demo} />;
}

function NeedsFormSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-60 rounded-3xl border border-line bg-white/70 motion-safe:animate-pulse" />
      ))}
    </div>
  );
}
