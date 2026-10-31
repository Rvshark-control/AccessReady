import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { ChecklistView } from "@/components/checklist/ChecklistView";
import { FlowStepper, FlowStepperSkeleton } from "@/components/layout/FlowStepper";
import { FlowPage, PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { firstParam, parseNeeds } from "@/utils/needs-param";

export const metadata: Metadata = {
  title: "Accommodation checklist",
  description: "Questions to ask a clinic about your accessibility needs. Copy them or download a text file.",
};

type SearchParams = PageProps<"/checklist">["searchParams"];

export default function ChecklistPage({ searchParams }: PageProps<"/checklist">) {
  return (
    <FlowPage>
      <Suspense fallback={<FlowStepperSkeleton />}>
        <StepperFromParams searchParams={searchParams} />
      </Suspense>

      <PageIntro
        eyebrow="Step 4 of 4 · Prepare for your appointment"
        title="Your accommodation checklist"
        description="Use these questions when you contact the clinic, by phone, email, or patient portal. Copy them or download a plain-text file. Nothing is sent automatically."
      />

      <Suspense fallback={<LoadingState label="Preparing your checklist…" rows={3} />}>
        <ChecklistFromParams searchParams={searchParams} />
      </Suspense>
    </FlowPage>
  );
}

async function StepperFromParams({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return <FlowStepper current="checklist" needs={parseNeeds(params.needs)} clinicId={firstParam(params.clinic)} />;
}

async function ChecklistFromParams({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const needs = parseNeeds(params.needs);
  const clinic = firstParam(params.clinic);

  if (needs.length === 0) {
    return (
      <EmptyState
        title="Your checklist needs at least one need"
        actions={
          <ButtonLink href="/needs" trailingIcon={<ArrowRight />}>
            Choose my accessibility needs
          </ButtonLink>
        }
      >
        Checklist questions are based on the accommodations you need. Choose at least one, and we&apos;ll prepare
        the questions to ask.
      </EmptyState>
    );
  }

  return <ChecklistView key={`${needs.join(",")}|${clinic ?? ""}`} needs={needs} initialClinicId={clinic} />;
}
