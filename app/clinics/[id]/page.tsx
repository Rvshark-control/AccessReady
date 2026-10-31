import type { Metadata } from "next";
import { Suspense } from "react";
import { ClinicDetailView } from "@/components/clinics/ClinicDetailView";
import { FlowPage } from "@/components/layout/PageIntro";
import { LoadingState } from "@/components/ui/States";
import { parseNeeds } from "@/utils/needs-param";

export const metadata: Metadata = {
  title: "Clinic details",
  description: "The accessibility record for a fictional clinic.",
};

export default function ClinicPage({ params, searchParams }: PageProps<"/clinics/[id]">) {
  return (
    <FlowPage>
      <Suspense fallback={<LoadingState label="Loading this clinic's record…" rows={3} />}>
        <ClinicFromParams params={params} searchParams={searchParams} />
      </Suspense>
    </FlowPage>
  );
}

async function ClinicFromParams({
  params,
  searchParams,
}: Pick<PageProps<"/clinics/[id]">, "params" | "searchParams">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const clinicId = decodeURIComponent(id);
  return <ClinicDetailView key={clinicId} clinicId={clinicId} needs={parseNeeds(query.needs)} />;
}
