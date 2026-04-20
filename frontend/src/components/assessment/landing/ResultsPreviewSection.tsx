import { Sparkles, Wand2, ArrowUpRight } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import SectionHeader from "./SectionHeader";

const scoreRows = [
  ["Strategy & governance", "62%", "#C5A04F"],
  ["Customer understanding", "78%", "#2D7A3A"],
  ["Journey design", "51%", "#EAAA08"],
  ["Measurement", "68%", "#3858E9"],
];

const outputs = [
  {
    title: "Focused and efficient",
    description: "A practical assessment designed to be completed in about 10 to 15 minutes.",
  },
  {
    title: "Clear to interpret",
    description: "Guided questions and a structured summary make the output easier to review and discuss.",
  },
  {
    title: "Action-oriented",
    description: "You receive scores, friction signals, strengths, and recommendations that can inform the next conversation immediately.",
  },
];

export default function ResultsPreviewSection() {
  return (
    <section className="px-5 py-16 md:px-8 md:py-24 lg:px-10">
      <style>
        {`
          @keyframes resultsLayerFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes resultsPanelLift {
            0%, 100% { transform: rotate(-2deg) translateY(0px); }
            50% { transform: rotate(-1deg) translateY(-8px); }
          }
        `}
      </style>

      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionHeader
            eyebrow="What you receive"
            title="A results view that helps teams decide what to do next"
            description="The output is designed to move quickly from assessment to action, with guided interpretation and a concise summary of the issues that matter most."
          />
        </FadeUp>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <FadeUp delay="delay-1">
            <div className="space-y-5">
              <div className="grid gap-4">
                {outputs.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-[#E5E7EB] bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.04)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(17,24,39,0.08)]"
                    style={{ transitionDelay: `${index * 70}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-[#FFF8CC] p-2 text-[#C5A04F]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#111827]">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm leading-7 text-[#667085]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </FadeUp>

          <FadeUp delay="delay-2">
            <div className="relative min-h-[31rem]">
              <div
                className="absolute right-4 top-0 hidden w-48 rounded-[1.35rem] border border-white/70 bg-white/82 p-4 shadow-[0_18px_44px_rgba(17,24,39,0.08)] backdrop-blur md:block"
                style={{ animation: "resultsLayerFloat 5.2s ease-in-out infinite" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Results snapshot
                </p>
                <div className="mt-4 space-y-3 text-sm text-[#111827]">
                  <div className="rounded-xl bg-[#F0F9F2] px-3 py-2">Strengths</div>
                  <div className="rounded-xl bg-[#FFF4E8] px-3 py-2">Pain points</div>
                  <div className="rounded-xl bg-[#EEF2FF] px-3 py-2">Priorities</div>
                </div>
              </div>

              <div className="absolute left-0 top-10 h-[24rem] w-full rounded-[2rem] bg-[linear-gradient(135deg,rgba(214,244,237,0.72),rgba(255,240,230,0.72)_55%,rgba(255,255,255,0.98))] shadow-[0_24px_60px_rgba(17,24,39,0.08)]" />

              <div
                className="absolute left-4 top-16 w-[calc(100%-3rem)] rounded-[2rem] border border-[#E5E7EB] bg-white/90 p-6 shadow-[0_24px_60px_rgba(17,24,39,0.10)] backdrop-blur md:left-8 md:w-[78%]"
                style={{ animation: "resultsPanelLift 6s ease-in-out infinite" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                      Guided results
                    </p>
                    <h3 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.04em] text-[#111827]">
                      Built for decision-making
                    </h3>
                  </div>
                  <div className="rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white">
                    68% overall
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {scoreRows.map(([label, value, color], index) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-[#111827]">{label}</span>
                        <span className="font-semibold text-[#111827]">{value}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#ECEFF1]">
                        <div
                          className="h-full rounded-full transition-all duration-700 hover:brightness-105"
                          style={{
                            width: value,
                            backgroundColor: color,
                            transitionDelay: `${index * 80}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Strengths", "#F0F9F2", "#2D7A3A"],
                    ["Pain points", "#FFF1F1", "#B42318"],
                    ["Priorities", "#EEF2FF", "#3858E9"],
                  ].map(([label, background, color]) => (
                    <div
                      key={label}
                      className="rounded-[1.25rem] px-4 py-4 text-sm font-semibold shadow-[0_10px_24px_rgba(17,24,39,0.05)] transition duration-500 hover:-translate-y-1"
                      style={{ backgroundColor: background, color }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.4rem] border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                        Benchmark insight
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#111827]">
                        Your strongest capabilities are approaching sector leaders
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3858E9] shadow-[0_6px_18px_rgba(17,24,39,0.06)]">
                      +12 pts
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm text-[#667085]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-[0_6px_18px_rgba(17,24,39,0.05)]">
                      Peer median
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#3858E9]" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-[0_6px_18px_rgba(17,24,39,0.05)]">
                      Best-in-class
                      <Sparkles className="h-3.5 w-3.5 text-[#C5A04F]" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-52 rounded-[1.45rem] border border-white/80 bg-white/86 p-4 shadow-[0_18px_44px_rgba(17,24,39,0.08)] backdrop-blur">
                <div className="flex items-center gap-2 text-[#C5A04F]">
                  <Wand2 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Recommended focus
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                  The results bring the most important priorities into one place,
                  making it easier to align on where action should begin.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
