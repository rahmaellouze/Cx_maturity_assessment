import type { AnswerOption, Question } from "@/features/questions/types/question.types";

type AssessmentQuickRepliesProps = {
  question: Question;
  selectedOptionIds: number[];
  disabled: boolean;
  onSelectOption: (option: AnswerOption) => void;
  onSubmitMultiSelect: () => void;
};

function getActiveOptions(question: Question) {
  return question.options
    .filter((option) => option.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export function AssessmentQuickReplies({
  question,
  selectedOptionIds,
  disabled,
  onSelectOption,
  onSubmitMultiSelect,
}: AssessmentQuickRepliesProps) {
  if (question.answer_type === "text_area") return null;

  const options = getActiveOptions(question);
  const isMultiSelect = question.answer_type === "multi_select";

  return (
    <div className="relative z-20 space-y-3 px-4 pt-4 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#98A2B3]">
          {isMultiSelect ? "Choose one or more replies" : "Choose a reply"}
        </p>
        {disabled ? <p className="text-xs text-[#98A2B3]">Assistant is typing...</p> : null}
      </div>

      <div className="-mx-1 relative z-20 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {options.map((option) => {
          const isSelected = option.id != null && selectedOptionIds.includes(option.id);

          return (
            <button
              key={option.id ?? option.option_value}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(option)}
              className={[
                "relative z-20 min-h-11 snap-start rounded-full border px-4 py-2.5 text-left text-sm font-medium shadow-[0_10px_24px_rgba(17,24,39,0.04)] transition duration-300 sm:min-h-0",
                isSelected
                  ? "border-[#E0D3AE] bg-[#FFFDF0] text-[#1A1A1A]"
                  : "border-[#E5E7EB] bg-white text-[#374151] hover:-translate-y-0.5 hover:border-[#E0D3AE] hover:bg-[#FCFCFC]",
                disabled ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              <span className="block leading-6">{option.option_label}</span>
            </button>
          );
        })}
      </div>

      {isMultiSelect ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#667085]">Select all that apply, then send your choices.</p>
          <button
            type="button"
            disabled={disabled || selectedOptionIds.length === 0}
            onClick={onSubmitMultiSelect}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#111827] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(17,24,39,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send selection
          </button>
        </div>
      ) : null}
    </div>
  );
}
