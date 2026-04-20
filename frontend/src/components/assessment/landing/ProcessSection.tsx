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
};

const stages: Stage[] = [
  {
    number: "01",
    label: "Step 01",
    title: "Start your assessment",
    description: "Provide the essentials so the assessment reflects your business environment.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    number: "02",
    label: "Step 02",
    title: "Complete the questions",
    description: "Move through a focused maturity diagnostic designed for clarity and speed.",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    number: "03",
    label: "Step 03",
    title: "Get your results",
    description: "Receive your maturity scores, top strengths, key pain points, and recommendations for what to improve next.",
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
            title="A simple path from first click to clear results"
            description="The experience is designed to stay clear, focused, and easy to complete, so you can move quickly from assessment to action."
          />
        </FadeUp>

        <FadeUp delay="delay-1">
          <div className="mt-14 rounded-4xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_44px_rgba(17,24,39,0.05)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {stages.map((stage) => (
                <div
                  key={stage.number}
                  className="rounded-[1.75rem] border border-[#E5E7EB] bg-[#F8FAFC] p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFFBEB] text-[#B7791F] shadow-[0_10px_24px_rgba(249,207,57,0.15)]">
                      {stage.icon}
                    </div>
                    <span className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#667085]">
                      {stage.number}
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-semibold text-[#111827]">{stage.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
