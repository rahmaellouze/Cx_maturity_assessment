import { ArrowDownRight, ArrowUpRight, Gauge, TriangleAlert } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
};

function SummaryCard({ label, value, detail, icon }: SummaryCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">{icon}</div>
      </div>
      <p className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

type Props = {
  overallScore: string;
  maturityLevel: string;
  strongestAxisLabel: string;
  strongestAxisValue: string;
  priorityAxisLabel: string;
  priorityAxisValue: string;
  keyPainPointCount: number;
  keyStrengthCount: number;
};

export default function AssessmentResultsSummary({
  overallScore,
  maturityLevel,
  strongestAxisLabel,
  strongestAxisValue,
  priorityAxisLabel,
  priorityAxisValue,
  keyPainPointCount,
  keyStrengthCount,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Overall score"
        value={overallScore}
        detail={`Maturity: ${maturityLevel}`}
        icon={<Gauge className="h-5 w-5" />}
      />
      <SummaryCard
        label="Strongest axis"
        value={strongestAxisLabel}
        detail={strongestAxisValue}
        icon={<ArrowUpRight className="h-5 w-5" />}
      />
      <SummaryCard
        label="Priority axis"
        value={priorityAxisLabel}
        detail={priorityAxisValue}
        icon={<ArrowDownRight className="h-5 w-5" />}
      />
      <SummaryCard
        label="Key signals"
        value={`${keyPainPointCount + keyStrengthCount}`}
        detail={`${keyPainPointCount} pain points • ${keyStrengthCount} strengths`}
        icon={<TriangleAlert className="h-5 w-5" />}
      />
    </div>
  );
}
