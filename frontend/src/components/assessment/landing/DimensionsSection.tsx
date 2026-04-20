import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  LineChart,
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import SectionHeader from "./SectionHeader";

type Pillar = {
  id: string;
  title: string;
  description: string;
  detail: string;
  highlights: string[];
  label: string;
  icon: ReactNode;
};

const pillars: Pillar[] = [
  {
    id: "strategy",
    title: "Strategy & Governance",
    description:
      "Assesses how clearly CX priorities, ownership, and decision-making are aligned across the organization.",
    detail:
      "This dimension examines whether leadership direction, accountability, and governance mechanisms provide a strong foundation for consistent customer experience improvement.",
    highlights: [
      "Leadership priorities are clearly defined and owned.",
      "Decision rights support consistent CX execution.",
      "Governance enables follow-through across teams.",
    ],
    label: "Foundation",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: "understanding",
    title: "Customer Understanding",
    description:
      "Evaluates how insight, feedback, and evidence are translated into decisions that shape the customer experience.",
    detail:
      "It looks at how effectively customer signals are gathered, interpreted, and turned into decisions that influence products, services, and operational priorities.",
    highlights: [
      "Customer evidence is captured in a structured way.",
      "Insight informs business and service decisions.",
      "Feedback loops support better prioritization.",
    ],
    label: "Insight",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "journey",
    title: "Journey Design",
    description:
      "Reviews how consistently journeys are designed, improved, and connected across channels and teams.",
    detail:
      "The focus is on whether end-to-end journeys are intentionally designed, coordinated across touchpoints, and improved in a disciplined and repeatable way.",
    highlights: [
      "Journeys are managed across channels, not in silos.",
      "Design decisions reflect operational realities.",
      "Improvements are connected to customer moments that matter.",
    ],
    label: "Delivery",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: "measurement",
    title: "Measurement & Improvement",
    description:
      "Assesses how performance measures and improvement loops support sustained progress and accountability over time.",
    detail:
      "This dimension reviews whether KPIs, governance reviews, and improvement cycles help teams monitor impact, maintain momentum, and improve with discipline.",
    highlights: [
      "Performance measures are tied to CX outcomes.",
      "Improvement cycles create accountability over time.",
      "Progress can be tracked, discussed, and sustained.",
    ],
    label: "Performance",
    icon: <LineChart className="h-5 w-5" />,
  },
];

export default function DimensionsSection() {
  const [activeId, setActiveId] = useState(pillars[0].id);
  const activeIndex = pillars.findIndex((pillar) => pillar.id === activeId);
  const activePillar = pillars[activeIndex];

  return (
    <section id="dimensions" className="px-5 py-16 md:px-8 md:py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionHeader
            eyebrow="Assessment dimensions"
            title="What the framework evaluates"
            description="The framework assesses four connected dimensions that together provide a structured view of customer experience maturity."
          />
        </FadeUp>

        <FadeUp delay="delay-1">
          <div className="mt-12 rounded-[2rem] border border-[#E5E7EB] bg-white p-4 shadow-[0_18px_44px_rgba(17,24,39,0.05)] md:p-6 lg:p-7">
            <div className="grid gap-5 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-7">
              <div
                className="grid gap-3"
                role="tablist"
                aria-label="Framework dimensions"
              >
                {pillars.map((pillar, index) => {
                  const isActive = pillar.id === activeId;

                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`dimension-panel-${pillar.id}`}
                      id={`dimension-tab-${pillar.id}`}
                      onClick={() => setActiveId(pillar.id)}
                      className={`group rounded-[1.4rem] border px-4 py-4 text-left transition duration-300 ${
                        isActive
                          ? "border-[#D9C98B] bg-[linear-gradient(180deg,#FFFDF7,#FFFFFF)] shadow-[0_14px_34px_rgba(17,24,39,0.06)]"
                          : "border-[#E5E7EB] bg-[#FCFCFC] hover:-translate-y-0.5 hover:border-[#D5D9E2] hover:bg-white hover:shadow-[0_12px_28px_rgba(17,24,39,0.05)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition duration-300 ${
                              isActive
                                ? "border-[#E0D3AE] bg-[#FFFDF0] text-[#C5A04F]"
                                : "border-[#E5E7EB] bg-white text-[#98A2B3] group-hover:text-[#C5A04F]"
                            }`}
                          >
                            {pillar.icon}
                          </div>
                          <div>
                            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                              0{index + 1}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#111827]">
                              {pillar.title}
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          className={`mt-1 h-4 w-4 transition duration-300 ${
                            isActive
                              ? "translate-x-0 text-[#C5A04F]"
                              : "text-[#D0D5DD] group-hover:translate-x-0.5 group-hover:text-[#98A2B3]"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                id={`dimension-panel-${activePillar.id}`}
                role="tabpanel"
                aria-labelledby={`dimension-tab-${activePillar.id}`}
                key={activePillar.id}
                className="relative overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] bg-[linear-gradient(135deg,rgba(255,253,247,0.98),rgba(248,250,252,0.98))] px-6 py-7 shadow-[0_14px_34px_rgba(17,24,39,0.04)] transition-all duration-300 md:px-8 md:py-9 lg:px-10 lg:py-10"
              >
                <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#FFF8CC]/50 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#EEF2FF]/60 blur-3xl" />

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                      {activePillar.label} dimension
                    </span>
                    <span className="rounded-full border border-[#E5E7EB] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#667085]">
                      0{activeIndex + 1} of 4
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E0D3AE] bg-[#FFFDF0] text-[#C5A04F] shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
                      {activePillar.icon}
                    </div>
                  </div>

                  <h3 className="mt-8 max-w-2xl text-[2rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#111827] md:text-[2.55rem]">
                    {activePillar.title}
                  </h3>

                  <p className="mt-6 max-w-2xl text-[1.08rem] leading-9 text-[#4B5563] md:text-[1.12rem]">
                    {activePillar.description}
                  </p>

                  <p className="mt-8 max-w-3xl text-[1rem] leading-8 text-[#667085] md:text-[1.04rem]">
                    {activePillar.detail}
                  </p>

                  <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(229,231,235,1),rgba(229,231,235,0))]" />

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {activePillar.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/72 px-4 py-4">
                        <div className="mt-1 rounded-full bg-[#F5F8F4] p-1.5 text-[#2D7A3A]">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <p className="text-[0.98rem] leading-8 text-[#344054]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
