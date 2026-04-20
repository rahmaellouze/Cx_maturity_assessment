import { ArrowRight, ClipboardList, FileText, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import FadeUp from "@/components/ui/FadeUp";
import SectionHeader from "./SectionHeader";

type Stage = {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  tone?: "default" | "accent";
};

const stages: Stage[] = [
  {
    number: "01",
    label: "Input",
    title: "Set context",
    description: "Add the essentials so the assessment reflects your business environment.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    number: "02",
    label: "Assessment",
    title: "Complete assessment",
    description: "Work through a focused maturity diagnostic designed for speed and clarity.",
    icon: <ClipboardList className="h-5 w-5" />,
    tone: "accent",
  },
  {
    number: "03",
    label: "Action",
    title: "Get priorities",
    description: "Receive a clear view of strengths, gaps, and where action should begin.",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="px-5 py-16 md:px-8 md:py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionHeader
            eyebrow="How it works"
            title="A simple flow from input to action"
            description="Three steps take you from business context to a clearer set of priorities."
          />
        </FadeUp>

        <FadeUp delay="delay-1">
          <div className="mt-14 overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[linear-gradient(180deg,#FFFFFF,rgba(248,250,252,0.96))] p-5 shadow-[0_22px_54px_rgba(17,24,39,0.05)] md:p-7 lg:p-8">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
              {stages.map((stage, index) => (
                <div key={stage.number} className="contents">
                  <article
                    className={`group relative overflow-hidden rounded-[1.85rem] border p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(17,24,39,0.07)] md:p-8 ${
                      stage.tone === "accent"
                        ? "border-[#D9C98B] bg-[linear-gradient(180deg,#FFFDF7,#FFFFFF)] shadow-[0_16px_40px_rgba(17,24,39,0.05)]"
                        : "border-[#E5E7EB] bg-white shadow-[0_12px_30px_rgba(17,24,39,0.04)]"
                    } ${index === 1 ? "lg:-translate-y-4" : ""}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(197,160,79,0),rgba(197,160,79,0.65),rgba(197,160,79,0))] opacity-0 transition duration-500 group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E0D3AE] bg-[#FFFDF0] text-[#C5A04F] shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
                        {stage.icon}
                      </div>
                      <div className="text-right">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                          {stage.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#111827]">
                          {stage.number}
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-8 text-[1.55rem] font-semibold leading-tight tracking-[-0.04em] text-[#111827] md:text-[1.75rem]">
                      {stage.title}
                    </h3>

                    <p className="mt-4 max-w-sm text-[1rem] leading-8 text-[#4B5563]">
                      {stage.description}
                    </p>
                  </article>

                  {index < stages.length - 1 ? (
                    <div className="hidden items-center justify-center lg:flex">
                      <div className="flex w-20 items-center gap-3">
                        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(197,160,79,0.12),rgba(56,88,233,0.28))]" />
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#98A2B3] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(56,88,233,0.28),rgba(197,160,79,0.12))]" />
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
