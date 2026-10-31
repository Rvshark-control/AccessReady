import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { FlowStepper, FlowStepperSkeleton } from "@/components/layout/FlowStepper";
import { FlowPage, PageIntro } from "@/components/layout/PageIntro";
import { SelectedNeeds } from "@/components/needs/SelectedNeeds";
import { ResultsView } from "@/components/results/ResultsView";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { parseNeeds } from "@/utils/needs-param";

export const metadata: Metadata = {
  title: "Compatibility results",
  description: "See which fictional clinics are ready for your accessibility needs, and what to verify.",
};

type SearchParams = PageProps<"/results">["searchParams"];

export default function ResultsPage({ searchParams }: PageProps<"/results">) {
  return (
    <FlowPage>
      <Suspense fallback={<FlowStepperSkeleton />}>
        <StepperFromParams searchParams={searchParams} />
      </Suspense>

      <PageIntro
        eyebrow="Step 3 of 4 · Compatibility results"
        title="Is each clinic ready for you?"
        description="We checked every need you selected against each fictional clinic's record. Here's what's confirmed, what's missing, and what to do next."
      />

      <Suspense fallback={<LoadingState label="Checking your needs against fictional clinic records…" rows={4} />}>
        <ResultsFromParams searchParams={searchParams} />
      </Suspense>
    </FlowPage>
  );
}

async function StepperFromParams({ searchParams }: { searchParams: SearchParams }) {
  const needs = parseNeeds((await searchParams).needs);
  return <FlowStepper current="results" needs={needs} />;
}

async function ResultsFromParams({ searchParams }: { searchParams: SearchParams }) {
  const needs = parseNeeds((await searchParams).needs);

  // An empty selection never produces a match. Send people back to choose needs.
  if (needs.length === 0) {
    return (
      <EmptyState
        title="Choose at least one need first"
        actions={
          <ButtonLink href="/needs" trailingIcon={<ArrowRight />}>
            Choose my accessibility needs
          </ButtonLink>
        }
      >
        Compatibility results are based on the accommodations you need. Select at least one, and we&apos;ll check
        every fictional clinic for you.
      </EmptyState>
    );
  }

  return (
    <>
      <SelectedNeeds needs={needs} />
      <ResultsView needs={needs} />
    </>
  );
}
