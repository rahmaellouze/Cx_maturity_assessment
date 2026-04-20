import { ShieldCheck, Lightbulb } from "lucide-react";

function getTone(priorityLevel: string): string {
  const normalized = priorityLevel.toLowerCase();
  if (normalized === "high") return "bg-rose-50 text-rose-700";
  if (normalized === "medium") return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

type Insight = {
  axisName: string;
  priorityLevel: string;
  recommendationTitle: string;
  questionText: string;
};

type ListCardProps = {
  title: string;
  icon: React.ReactNode;
  items: Insight[];
  emptyState: string;
};

function InsightCard({ item }: { item: Insight }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">{item.axisName}</span>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${getTone(item.priorityLevel)}`}>
          {item.priorityLevel}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">{item.recommendationTitle}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.questionText}</p>
    </div>
  );
}

function SummaryCard({ title, icon, items, emptyState }: ListCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">Top themes surfaced from answer-level recommendations.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        {items.length > 0 ? (
          items.map((item) => <InsightCard key={`${item.axisName}-${item.recommendationTitle}`} item={item} />)
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">{emptyState}</div>
        )}
      </div>
    </div>
  );
}

export default function AxisInsightsSection({
  strengths,
  painPoints,
}: {
  strengths: Insight[];
  painPoints: Insight[];
}) {
  return (
    <div className="grid gap-4">
      <SummaryCard
        title="Main strengths"
        icon={<ShieldCheck className="h-5 w-5" />}
        items={strengths}
        emptyState="No strong themes were detected yet from the responses."
      />
      <SummaryCard
        title="Main pain points"
        icon={<Lightbulb className="h-5 w-5" />}
        items={painPoints}
        emptyState="No major pain themes were detected in the current answers."
      />
    </div>
  );
}
