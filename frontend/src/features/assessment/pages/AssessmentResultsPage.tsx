import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { getAssessmentResults } from "@/features/assessment/api/assessmentApi";
import AxisResultCard from "@/features/assessment/components/results/AxisResultCard";
import DonutChart from "@/features/assessment/components/results/DonutChart";
import type {
  AssessmentAnswerLog,
  AssessmentAxisResult,
  AssessmentRecommendation,
  AssessmentResults,
} from "@/features/assessment/types/assessment.types";

type DetailInsight = {
  axisId: number;
  axisCode: string;
  axisName: string;
  questionId: number | null;
  questionCode: string | null;
  questionText: string;
  selectedAnswer: string;
  recommendationTitle: string;
  recommendationText: string;
  priorityLevel: string;
  insightType: "strength" | "pain_point";
};

type ParsedSummaryRecommendation = {
  narrative: string | null;
  actions: string[];
};

type AxisSection = {
  axis: AssessmentAxisResult;
  summaryRecommendation: AssessmentRecommendation | null;
  parsedSummaryRecommendation: ParsedSummaryRecommendation;
  detailInsights: DetailInsight[];
  strengths: DetailInsight[];
  painPoints: DetailInsight[];
};

const priorityRank: Record<string, number> = {
  high: 0,
  medium: 1,
  maintain: 2,
};

function formatPercent(value: number | null): string {
  if (value === null) return "-";
  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  return `${rounded}%`;
}

function formatScoreRange(rawScore: number | null, maxScore: number | null): string {
  if (rawScore === null || maxScore === null) return "Not scored";
  const raw = Number.isInteger(rawScore) ? rawScore.toFixed(0) : rawScore.toFixed(1);
  const max = Number.isInteger(maxScore) ? maxScore.toFixed(0) : maxScore.toFixed(1);
  return `${raw} / ${max} points`;
}

function getSelectedAnswerLabel(answer?: AssessmentAnswerLog): string {
  if (!answer) return "No response captured";
  if (answer.selected_option_label) return answer.selected_option_label;
  if (answer.selected_options.length > 0) {
    return answer.selected_options.map((item) => item.option_label).join(", ");
  }
  if (answer.answer_text?.trim()) return answer.answer_text.trim();
  return "No response captured";
}

function parseSummaryRecommendation(text: string | null): ParsedSummaryRecommendation {
  if (!text) {
    return {
      narrative: null,
      actions: [],
    };
  }

  const [narrativePart, actionsPart] = text.split(/Priority actions:/i);
  const narrative = narrativePart?.trim() || null;
  const actions = (actionsPart || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-\s*/, ""));

  return {
    narrative,
    actions,
  };
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

function getMaturityTone(score: number | null): string {
  if (score === null) return "border-slate-200 bg-slate-50 text-slate-600";
  if (score < 40) return "border-rose-200 bg-rose-50 text-rose-700";
  if (score < 75) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function sortInsights(a: DetailInsight, b: DetailInsight): number {
  const priorityGap = (priorityRank[a.priorityLevel.toLowerCase()] ?? 99) - (priorityRank[b.priorityLevel.toLowerCase()] ?? 99);
  if (priorityGap !== 0) return priorityGap;
  return a.axisName.localeCompare(b.axisName) || a.questionText.localeCompare(b.questionText);
}

function SummaryListCard({
  title,
  icon,
  items,
  emptyState,
}: {
  title: string;
  icon: ReactNode;
  items: DetailInsight[];
  emptyState: string;
}) {
  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F8FAFC] text-[#111827]">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
          <p className="text-sm text-[#6B7280]">Derived from detailed themes in the workbook.</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.axisId}-${item.questionId}-${item.recommendationTitle}`}
              className="rounded-2xl border border-[#F1F5F9] bg-[#FCFCFC] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#4B5563]">
                  {item.axisName}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getPriorityTone(
                    item.priorityLevel
                  )}`}
                >
                  {item.priorityLevel}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#111827]">{item.recommendationTitle}</p>
              <p className="mt-2 text-sm text-[#374151]">{item.questionText}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-[#D1D5DB] bg-[#FAFAFA] p-4 text-sm text-[#6B7280]">
          {emptyState}
        </div>
      )}
    </div>
  );
}

function buildAxisSection(axis: AssessmentAxisResult): AxisSection {
  const answersByQuestionId = new Map<number, AssessmentAnswerLog>(
    axis.answers.map((answer) => [answer.question_id, answer])
  );

  const summaryRecommendation =
    axis.recommendations.find((item) => item.recommendation_type === "axis_summary") ?? null;

  const detailInsights = axis.recommendations
    .filter((item) => item.recommendation_type === "answer_detail")
    .map<DetailInsight>((item) => {
      const answer = item.question_id !== null ? answersByQuestionId.get(item.question_id) : undefined;
      const priorityLevel = item.priority_level || "Medium";

      return {
        axisId: axis.axis_id,
        axisCode: axis.code,
        axisName: axis.name,
        questionId: item.question_id,
        questionCode: item.question_code ?? null,
        questionText: answer?.question_text ?? item.recommendation_title,
        selectedAnswer: getSelectedAnswerLabel(answer),
        recommendationTitle: item.recommendation_title,
        recommendationText: item.recommendation_text,
        priorityLevel,
        insightType: priorityLevel.toLowerCase() === "maintain" ? "strength" : "pain_point",
      };
    })
    .sort(sortInsights);

  return {
    axis,
    summaryRecommendation,
    parsedSummaryRecommendation: parseSummaryRecommendation(
      summaryRecommendation?.recommendation_text ?? axis.priority_actions
    ),
    detailInsights,
    strengths: detailInsights.filter((item) => item.insightType === "strength"),
    painPoints: detailInsights.filter((item) => item.insightType === "pain_point"),
  };
}

export default function AssessmentResultsPage() {
  const { assessmentId } = useParams();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAxisIds, setExpandedAxisIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadResults() {
      if (!assessmentId) return;
      try {
        setLoading(true);
        const data = await getAssessmentResults(Number(assessmentId));
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [assessmentId]);

  const axisSections = useMemo(() => {
    if (!results) return [];
    return results.axes.map(buildAxisSection);
  }, [results]);

  const strengthCount = useMemo(
    () => axisSections.flatMap((section) => section.strengths).length,
    [axisSections]
  );

  const painPointCount = useMemo(
    () => axisSections.flatMap((section) => section.painPoints).length,
    [axisSections]
  );

  const allStrengths = useMemo(
    () => axisSections.flatMap((section) => section.strengths).sort(sortInsights).slice(0, 4),
    [axisSections]
  );

  const allPainPoints = useMemo(
    () => axisSections.flatMap((section) => section.painPoints).sort(sortInsights).slice(0, 4),
    [axisSections]
  );

  const bestAxis = useMemo(() => {
    const scoredAxes = axisSections.filter((section) => section.axis.score_percent !== null);
    return scoredAxes.sort((left, right) => (right.axis.score_percent ?? 0) - (left.axis.score_percent ?? 0))[0] ?? null;
  }, [axisSections]);

  const focusAxis = useMemo(() => {
    const scoredAxes = axisSections.filter((section) => section.axis.score_percent !== null);
    return scoredAxes.sort((left, right) => (left.axis.score_percent ?? 0) - (right.axis.score_percent ?? 0))[0] ?? null;
  }, [axisSections]);

  useEffect(() => {
    if (axisSections.length === 0) return;
    setExpandedAxisIds((current) => {
      if (current.length > 0) return current;
      // All cards collapsed by default - users expand on demand
      return [];
    });
  }, [axisSections]);

  function toggleAxis(axisId: number) {
    setExpandedAxisIds((current) =>
      current.includes(axisId)
        ? current.filter((item) => item !== axisId)
        : [...current, axisId]
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl p-8 text-sm text-[#6B7280]">Loading results...</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-6xl p-8 text-sm text-red-600">{error}</div>;
  }

  if (!results) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <section className="rounded-[32px] border border-[#E5E7EB] bg-gradient-to-br from-[#FFFDF7] via-white to-[#F8FAFC] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:gap-8">
            <div className="flex items-end">
              
            </div>

            <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF8CC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C5C00]">
              <Sparkles className="h-3.5 w-3.5" />
              Assessment dashboard
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
              Assessment results
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#4B5563] md:text-base">
              This view now separates the results into three layers: score summary, respondent strengths and pain points,
              and axis-by-axis recommendations with expandable answer-level details.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#6B7280]">
              {results.respondent_name ? (
                <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-[#E5E7EB]">
                  Respondent: <span className="font-semibold text-[#111827]">{results.respondent_name}</span>
                </span>
              ) : null}
              {results.company_name ? (
                <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-[#E5E7EB]">
                  Company: <span className="font-semibold text-[#111827]">{results.company_name}</span>
                </span>
              ) : null}
              {results.respondent_role_title ? (
                <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-[#E5E7EB]">
                  Role: <span className="font-semibold text-[#111827]">{results.respondent_role_title}</span>
                </span>
              ) : null}
            </div>
            </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[420px]">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280]">
                <Gauge className="h-4 w-4" />
                Overall score
              </div>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-[#111827]">
                {formatPercent(results.overall_score)}
              </p>
              <p className="mt-2 text-sm text-[#6B7280]">
                Maturity level: <span className="font-semibold text-[#111827]">{results.maturity_level ?? "-"}</span>
              </p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280]">
                <ArrowUpRight className="h-4 w-4" />
                Strongest axis
              </div>
              <p className="mt-3 text-xl font-semibold text-[#111827]">{bestAxis?.axis.name ?? "-"}</p>
              <p className="mt-2 text-sm text-[#6B7280]">
                {bestAxis ? formatPercent(bestAxis.axis.score_percent) : "No scored axis yet"}
              </p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280]">
                <ArrowDownRight className="h-4 w-4" />
                Priority axis
              </div>
              <p className="mt-3 text-xl font-semibold text-[#111827]">{focusAxis?.axis.name ?? "-"}</p>
              <p className="mt-2 text-sm text-[#6B7280]">
                {focusAxis ? formatPercent(focusAxis.axis.score_percent) : "No scored axis yet"}
              </p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280]">
                <TriangleAlert className="h-4 w-4" />
                Detailed signals
              </div>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-[#111827]">{painPointCount}</p>
              <p className="mt-2 text-sm text-[#6B7280]">
                pain points • <span className="font-semibold text-[#111827]">{strengthCount}</span> strengths
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Gauge className="h-5 w-5 text-[#111827]" />
          <h2 className="text-xl font-semibold text-[#111827]">Score summary by axis</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {axisSections.map((section) => {
            return (
              <div
                key={section.axis.axis_id}
                className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full">
                    <p className="text-sm font-medium uppercase tracking-wide text-[#6B7280]">{section.axis.name}</p>
                    <p className="mt-2 text-sm text-[#6B7280]">
                      {formatScoreRange(section.axis.raw_score, section.axis.max_score)}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <DonutChart 
                      percentage={section.axis.score_percent} 
                      size={100} 
                      strokeWidth={8} 
                      color="#111827" 
                      backgroundColor="#e5e7eb" 
                    />
                  </div>

                  <div className="w-full text-center">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${getMaturityTone(
                        section.axis.score_percent
                      )}`}
                    >
                      {section.axis.maturity_band ?? "Not scored"}
                    </span>
                  </div>

                  {section.axis.description ? (
                    <p className="text-sm leading-6 text-[#4B5563]">{section.axis.description}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SummaryListCard
          title="Main strengths"
          icon={<ShieldCheck className="h-5 w-5" />}
          items={allStrengths}
          emptyState="No strong strength themes were detected yet from the selected answers. As the respondent scores higher on more items, this section will highlight what is working well and should be preserved."
        />
        <SummaryListCard
          title="Main pain points"
          icon={<Lightbulb className="h-5 w-5" />}
          items={allPainPoints}
          emptyState="No major pain-point themes were detected from the current answers. When lower-scoring answers appear, the main friction points will be listed here."
        />
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#111827]" />
          <h2 className="text-xl font-semibold text-[#111827]">Axis recommendations</h2>
        </div>

        {axisSections.map((section) => {
          const isExpanded = expandedAxisIds.includes(section.axis.axis_id);

          return (
            <AxisResultCard
              key={section.axis.axis_id}
              axis={section.axis}
              summaryNarrative={section.parsedSummaryRecommendation.narrative}
              summaryActions={section.parsedSummaryRecommendation.actions}
              strengthsCount={section.strengths.length}
              painPointsCount={section.painPoints.length}
              detailInsights={section.detailInsights}
              isExpanded={isExpanded}
              onToggle={() => toggleAxis(section.axis.axis_id)}
            />
          );
        })}
      </section>
    </div>
  );
}
