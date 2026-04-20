import type { ReactNode } from "react";
import {
  BarChart3,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";
import SectionHeader from "./SectionHeader";

type Pillar = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
};

const pillars: Pillar[] = [
  {
    id: "strategy",
    title: "Strategy & Governance",
    description:
      "Understand how clearly customer experience priorities, ownership, and decisions are organized across your business.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: "understanding",
    title: "Customer Understanding",
    description:
      "See how well customer needs, feedback, and insight are captured and turned into meaningful action.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "journey",
    title: "Journey Design",
    description:
      "Review how consistently your journeys are designed, improved, and connected across channels and teams.",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: "measurement",
    title: "Measurement & Improvement",
    description:
      "Measure how well your KPIs, outcomes, and improvement loops help you improve over time.",
    icon: <LineChart className="h-5 w-5" />,
  },
];

export default function DimensionsSection() {
  return (
    <section id="dimensions" className="px-5 py-16 md:px-8 md:py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionHeader
            eyebrow="Assessment dimensions"
            title="What the assessment looks at"
            description="The assessment focuses on the core capabilities that shape the experience your customers actually feel across journeys, channels, and operations."
          />
        </FadeUp>

        <FadeUp delay="delay-1">
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-4xl border border-[#E5E7EB] bg-white p-8 shadow-[0_18px_44px_rgba(17,24,39,0.05)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFFBEB] text-[#B7791F] shadow-[0_10px_24px_rgba(249,207,57,0.15)]">
                  {pillar.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#111827]">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#475467]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
