import { ArrowLeft, RotateCcw, SendHorizonal } from "lucide-react";

type AssessmentChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onBack: () => void;
  onRestart: () => void;
  disabled: boolean;
  canGoBack: boolean;
  placeholder: string;
};

export function AssessmentChatComposer({
  value,
  onChange,
  onSend,
  onBack,
  onRestart,
  disabled,
  canGoBack,
  placeholder,
}: AssessmentChatComposerProps) {
  return (
    <div className="bg-transparent px-4 pb-4 pt-3 md:px-6 md:pb-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#98A2B3]">Write naturally here. Commands like `next`, `back`, and `restart` still work.</p>
        <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || !canGoBack}
          onClick={onBack}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/92 px-3 text-sm font-medium text-[#4B5563] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onRestart}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/92 px-3 text-sm font-medium text-[#4B5563] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Restart
        </button>
        </div>
      </div>

      <div className="flex items-end gap-3 rounded-[1.7rem] border border-[#E5E7EB] bg-white/96 p-2 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
        <textarea
          value={value}
          disabled={disabled}
          rows={1}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder={placeholder}
          className="min-h-[52px] flex-1 resize-none rounded-[1.2rem] border-0 px-4 py-3 text-base text-[#111827] outline-none transition placeholder:text-base placeholder:text-[#98A2B3]"
          style={{ backgroundColor: "#F8FAFC" }}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onSend}
          className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "#111827" }}
          aria-label="Send message"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
