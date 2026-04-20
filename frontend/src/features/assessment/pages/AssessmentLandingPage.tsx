import PublicLayout from "@/components/layout/PublicLayout";
import HeroSection from "@/components/assessment/hero/HeroSection";
import DimensionsSection from "@/components/assessment/landing/DimensionsSection";
import ProcessSection from "@/components/assessment/landing/ProcessSection";
import ResultsPreviewSection from "@/components/assessment/landing/ResultsPreviewSection";

export default function AssessmentLandingPage() {
  return (
    <PublicLayout>
      <HeroSection />
      <DimensionsSection />
      <ProcessSection />
      <ResultsPreviewSection />
    </PublicLayout>
  );
}
