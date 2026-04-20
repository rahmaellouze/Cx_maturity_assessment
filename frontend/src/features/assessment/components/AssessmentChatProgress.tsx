import type { AssessmentChatProgress as AssessmentChatProgressType } from "@/features/assessment/types/assessment.types";

type AssessmentChatProgressProps = {
  companyName: string | null | undefined;
  progress: AssessmentChatProgressType;
};

export function AssessmentChatProgress({ companyName, progress }: AssessmentChatProgressProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[linear-gradient(135deg,rgba(214,244,237,0.78),rgba(255,240,230,0.78)_55%,rgba(255,255,255,0.96))] p-5 shadow-[0_24px_60px_rgba(17,24,39,0.08)] md:p-7">
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(#E5E7EB_1px,transparent_1px),linear-gradient(90deg,#E5E7EB_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute bottom-[-2rem] right-[10%] h-28 w-28 rounded-full bg-[#F6EFD6]/75 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#C5A04F] shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
            Conversational assessment
          </p>
          <h1 className="mt-4 text-[2.2rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#111827] md:text-[3.1rem]">
            CX maturity chat
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4B5563] md:text-[1rem]">
            {companyName ?? "Your company"} is moving through a guided conversation with tailored transitions and one focused question at a time.
          </p>
        </div>

        <div className="min-w-[260px] rounded-[1.6rem] border border-[#E5E7EB] bg-white/88 p-4 shadow-[0_14px_34px_rgba(17,24,39,0.05)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                Progress
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#111827]">
                {progress.label}
              </p>
            </div>
            <div className="rounded-full bg-[#111827] px-3 py-1.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(17,24,39,0.08)]">
              {Math.round(progress.percentage)}%
            </div>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#ECEFF1]">
            <div
              className="h-full rounded-full bg-[#111827] transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-[#98A2B3]">
            <span>Current question</span>
            <span>{progress.current}/{progress.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
