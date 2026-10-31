import { Hero } from "@/components/landing/Hero";
import { AccessibilityPromise, FinalCta, HowItWorks, StatusExplainer } from "@/components/landing/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <StatusExplainer />
      <AccessibilityPromise />
      <FinalCta />
    </>
  );
}
