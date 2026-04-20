import type { AssessmentAxisResult } from "@/features/assessment/types/assessment.types";
import { BarChart3 } from "lucide-react";

function getBarTone(score: number | null): string {
  if (score === null) return "bg-slate-300";
  if (score < 40) return "bg-rose-500";
  if (score < 75) return "bg-amber-500";
  return "bg-emerald-500";
}

type Props = {
  axes: Pick<AssessmentAxisResult, "axis_id" | "name" | "score_percent" | "maturity_band" | "raw_score" | "max_score">[];
};

export default function AxisScoreChart({ axes }: Props) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Axis score comparison</h2>
          <p className="mt-1 text-sm text-slate-500">Visualizing relative axis performance and maturity status.</p>
        </div>
      </div>

      <div className="space-y-4">
        {axes.map((axis) => {
          const width = Math.max(0, Math.min(axis.score_percent ?? 0, 100));
          return (
            <div key={axis.axis_id} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-slate-900">{axis.name}</p>
                <span className="text-sm font-semibold text-slate-600">{axis.score_percent !== null ? `${Math.round(axis.score_percent)}%` : "—"}</span>
              </div>
              <meter
                value={axis.score_percent ?? 0}
                min={0}
                max={100}
                className={`h-3 w-full rounded-full bg-slate-100 ${getBarTone(axis.score_percent)} transition-all duration-500`}
              />
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-400">
                <span>{axis.raw_score !== null && axis.max_score !== null ? `${axis.raw_score}/${axis.max_score}` : "Not scored"}</span>
                <span>{axis.maturity_band ?? "Unknown"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
