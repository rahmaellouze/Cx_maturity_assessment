import type { AssessmentAxisResult } from "@/features/assessment/types/assessment.types";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

function getTone(score: number | null): string {
  if (score === null) return "border-slate-200 bg-slate-50 text-slate-600";
  if (score < 40) return "border-rose-200 bg-rose-50 text-rose-700";
  if (score < 75) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getPriorityTone(priorityLevel: string): string {
  switch (priorityLevel.toLowerCase()) {
    case "high":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

type Insight = {
  questionId: number | null;
  questionCode: string | null;
  questionText: string;
  selectedAnswer: string;
  recommendationTitle: string;
  recommendationText: string;
  priorityLevel: string;
};

type ParsedSummaryRecommendation = {
  narrative: string | null;
  actions: string[];
};

type Props = {
  axis: AssessmentAxisResult;
  summaryNarrative: string | null;
  summaryActions: string[];
  strengthsCount: number;
  painPointsCount: number;
  detailInsights: Insight[];
  isExpanded: boolean;
  onToggle: () => void;
};

export default function AxisResultCard({
  axis,
  summaryNarrative,
  summaryActions,
  strengthsCount,
  painPointsCount,
  detailInsights,
  isExpanded,
  onToggle,
}: Props) {
  return (
    <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Header: Title + Compact Score + Maturity Badge + Toggle */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{axis.name}</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <TrendingUp className="h-3 w-3" />
                {axis.score_percent !== null ? `${Math.round(axis.score_percent)}%` : "—"}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getTone(axis.score_percent)}`}>
                {axis.maturity_band ?? "Not scored"}
              </span>
            </div>
          </div>
          {axis.description && <p className="mt-2 text-sm text-slate-600">{axis.description}</p>}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100"
        >
          {isExpanded ? "Hide details" : "Show details"}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Recommendation Summary */}
      <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Recommendation summary</p>
        <p className="mt-3 text-sm leading-6 text-slate-700">{summaryNarrative ?? "No recommendation summary available."}</p>
        {summaryActions.length > 0 ? (
          <div className="mt-4 space-y-3">
            {summaryActions.slice(0, 3).map((action) => (
              <div key={action} className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900" />
                <p className="text-sm text-slate-700">{action}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">{strengthsCount} strengths</span>
        <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">{painPointsCount} pain points</span>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Detailed recommendations</h4>
              <p className="mt-1 text-sm text-slate-500">Answer-level insights are hidden until you expand this axis.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">{strengthsCount} strengths</span>
              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">{painPointsCount} pain points</span>
            </div>
          </div>

          {detailInsights.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {detailInsights.map((item) => (
                <div key={`${item.questionId ?? "none"}-${item.recommendationTitle}`} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.questionCode ? (
                      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">{item.questionCode}</span>
                    ) : null}
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${getPriorityTone(item.priorityLevel)}`}>
                      {item.priorityLevel}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{item.questionText}</p>
                  <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Selected answer</p>
                    <p className="mt-2">{item.selectedAnswer}</p>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{item.recommendationTitle}</p>
                    <p>{item.recommendationText}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-500">
              No answer-level recommendations were generated for this axis yet.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
