import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareView } from "@/components/clinics/CompareView";
import { FlowStepper, FlowStepperSkeleton } from "@/components/layout/FlowStepper";
import { FlowPage, PageIntro } from "@/components/layout/PageIntro";
import { SelectedNeeds } from "@/components/needs/SelectedNeeds";
import { LoadingState } from "@/components/ui/States";
import { parseNeeds } from "@/utils/needs-param";

export const metadata: Metadata = {
  title: "Compare clinics",
  description: "Compare the accessibility capabilities of fictional clinics side by side.",
};

type SearchParams = PageProps<"/compare">["searchParams"];

export default function ComparePage({ searchParams }: PageProps<"/compare">) {
  return (
    <FlowPage>
      <Suspense fallback={<FlowStepperSkeleton />}>
        <StepperFromParams searchParams={searchParams} />
      </Suspense>

      <PageIntro
        eyebrow="Step 2 of 4 · Compare accessibility"
        title="How do the clinics compare?"
        description="Each fictional clinic's record lists every accommodation as confirmed, unavailable, or unknown. Your needs are pinned to the top."
      />

      <Suspense fallback={<LoadingState label="Loading fictional clinic records…" rows={4} />}>
        <CompareFromParams searchParams={searchParams} />
      </Suspense>
    </FlowPage>
  );
}

async function StepperFromParams({ searchParams }: { searchParams: SearchParams }) {
  const needs = parseNeeds((await searchParams).needs);
  return <FlowStepper current="compare" needs={needs} />;
}

async function CompareFromParams({ searchParams }: { searchParams: SearchParams }) {
  const needs = parseNeeds((await searchParams).needs);
  return (
    <>
      {needs.length > 0 ? <SelectedNeeds needs={needs} /> : null}
      <CompareView needs={needs} />
    </>
  );
}
