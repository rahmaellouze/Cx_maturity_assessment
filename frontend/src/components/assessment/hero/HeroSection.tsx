import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Bot, Sparkles, Cpu } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import AssessmentStartForm from "@/components/assessment/forms/AssessmentStartForm";
export default function HeroSection() {
  return (
    <section id="overview" className="px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[linear-gradient(135deg,rgba(214,244,237,0.78),rgba(255,240,230,0.78)_55%,rgba(255,255,255,0.96))] px-6 py-20 shadow-[0_24px_60px_rgba(17,24,39,0.06)] md:px-10 md:py-24 lg:px-14">
          <style>
            {`
              @keyframes aiFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }

              @keyframes aiPulse {
                0%, 100% { opacity: 0.72; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.08); }
              }

              @keyframes aiOrbit {
                to { transform: rotate(360deg); }
              }

              @keyframes sectionBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(6px); }
              }

            `}
          </style>

          <div className="absolute inset-0 opacity-[0.2] [background-image:linear-gradient(#E5E7EB_1px,transparent_1px),linear-gradient(90deg,#E5E7EB_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute left-[8%] top-[12%] h-32 w-32 rounded-full bg-white/55 blur-3xl" />
          <div className="absolute bottom-[-2rem] right-[12%] h-40 w-40 rounded-full bg-[#F6EFD6]/70 blur-3xl" />

          <div className="relative mx-auto flex max-w-5xl flex-col">
            <FadeUp>
              <div className="w-full text-left">
                <p className="mb-4 inline-flex items-center rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-[#C5A04F] shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
                  CX maturity framework
                </p>
              </div>
            </FadeUp>

            <FadeUp delay="delay-1">
              <div className="grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-10">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <h1 className="w-full text-[3rem] font-semibold leading-[0.94] tracking-[-0.06em] text-[#1A1A1A] md:text-[4.3rem] lg:text-[4.9rem]">
                    Understand your customer experience maturity with greater clarity
                  </h1>

                  <p className="mt-7 w-full max-w-3xl text-[1.05rem] leading-8 text-[#4B5563] md:text-[1.2rem]">
                    Assess the capabilities shaping your customer experience, identify
                    where delivery is strongest, and surface the priorities that
                    deserve attention next.
                  </p>

                  <div className="mt-8 flex w-full justify-center lg:justify-start">
                    <AssessmentStartForm />
                  </div>
                </div>

                <div className="relative mx-auto flex h-[12rem] w-[12rem] items-center justify-center md:mx-0">
                  <div className="absolute inset-0 rounded-full border border-[#3858E9]/12" />
                  <div className="absolute inset-4 rounded-full border border-[#E5E7EB] bg-white/35 backdrop-blur-[2px]" />
                  <div
                    className="absolute inset-1 rounded-full border border-[#C5A04F]/18"
                    style={{ animation: "aiOrbit 16s linear infinite" }}
                  >
                    <span className="absolute left-6 top-5 h-2.5 w-2.5 rounded-full bg-[#3858E9]" />
                    <span className="absolute bottom-6 right-5 h-2.5 w-2.5 rounded-full bg-[#C5A04F]" />
                  </div>
                  <div
                    className="absolute inset-7 rounded-full border border-[#3858E9]/10"
                    style={{ animation: "aiOrbit 11s linear infinite reverse" }}
                  >
                    <span className="absolute bottom-5 left-8 h-2.5 w-2.5 rounded-full bg-[#2D7A3A]" />
                  </div>

                  <div
                    className="absolute bottom-5 h-16 w-36 rounded-full bg-[#3858E9]/12 blur-2xl"
                    style={{ animation: "aiPulse 3.2s ease-in-out infinite" }}
                  />

                  <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/90 bg-[linear-gradient(180deg,#FFFFFF,#EEF2FF)] shadow-[0_24px_54px_rgba(17,24,39,0.16)]"
                    style={{ animation: "aiFloat 4.8s ease-in-out infinite" }}
                  >
                    <div className="absolute -top-3 flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#C5A04F]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#3858E9]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#2D7A3A]" />
                    </div>
                    <Bot className="h-9 w-9 text-[#3858E9]" />
                    <div className="absolute -right-3 -top-2 rounded-full border border-white/80 bg-white p-2 shadow-[0_8px_20px_rgba(17,24,39,0.10)]">
                      <Sparkles className="h-4 w-4 text-[#C5A04F]" />
                    </div>
                    <div className="absolute -left-3 -bottom-2 rounded-full border border-white/80 bg-white p-2 shadow-[0_8px_20px_rgba(17,24,39,0.10)]">
                      <Cpu className="h-4 w-4 text-[#3858E9]" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>

        <FadeUp delay="delay-3">
          <div className="flex justify-center pt-20 md:pt-24">
            <a
              href="#dimensions"
              className="inline-flex flex-col items-center gap-2 text-sm font-semibold tracking-[0.02em] text-[#98A2B3] transition hover:text-[#111827]"
            >
              See what the framework covers
              <ArrowDown
                className="h-4 w-4"
                style={{ animation: "sectionBounce 1.4s ease-in-out infinite" }}
              />
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
