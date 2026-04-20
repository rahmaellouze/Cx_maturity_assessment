import PublicLayout from "@/components/layout/PublicLayout";
import AssessmentStartForm from "@/components/assessment/forms/AssessmentStartForm";

export default function AssessmentStartPage() {
  return (
    <PublicLayout>
      <section className="px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-[#E5E7EB] bg-[linear-gradient(135deg,rgba(214,244,237,0.66),rgba(255,240,230,0.7)_55%,rgba(255,255,255,0.96))] p-8 shadow-[0_24px_60px_rgba(17,24,39,0.06)] md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C5A04F]">
              Start your assessment
            </p>
            <h1 className="mt-4 max-w-3xl text-[2.4rem] font-semibold leading-tight tracking-[-0.05em] text-[#1A1A1A] md:text-[3.4rem]">
              Start your CX maturity assessment
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#4B5563]">
              Go straight into the chatbot. You will answer the assessment questions first, then provide profiling information at the end.
            </p>

            <div className="mt-8 max-w-xl">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white/70 px-4 py-3 text-sm text-[#6B7280] backdrop-blur">
                No upfront form is required anymore. Your profiling details will be collected conversationally at the end of the assessment.
              </div>
              <div className="mt-5">
                <AssessmentStartForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
