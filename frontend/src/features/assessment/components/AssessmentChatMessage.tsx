import type { AssessmentChatMessage } from "@/features/assessment/types/assessment.types";

type AssessmentChatMessageProps = {
  message: AssessmentChatMessage;
};

export function AssessmentChatMessage({ message }: AssessmentChatMessageProps) {
  if (message.type === "system_progress") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full border border-[#E5E7EB] bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#667085] shadow-sm backdrop-blur">
          {message.text}
        </div>
      </div>
    );
  }

  const isUser = message.type === "user_answer";
  const isQuestion = message.type === "assistant_question";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[90%] rounded-[1.7rem] px-4 py-3 text-base shadow-[0_14px_34px_rgba(17,24,39,0.05)] md:max-w-[75%]",
          isUser
            ? "rounded-br-md border border-[#111827] bg-[#111827] text-white"
            : isQuestion
              ? "rounded-bl-md border border-[#E5E7EB] bg-white text-[#111827]"
              : "rounded-bl-md border border-[#E5E7EB] bg-[#FFFDF7] text-[#374151]",
        ].join(" ")}
      >
        {isQuestion ? (
          <>
            {message.questionCode ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C5A04F]">
                {message.questionCode}
              </p>
            ) : null}
            <p className={message.questionCode ? "mt-1 text-base leading-8 whitespace-pre-wrap" : "text-base leading-8 whitespace-pre-wrap"}>
              {message.text}
            </p>
            {message.helperText ? <p className="mt-2 text-xs leading-6 text-[#667085]">{message.helperText}</p> : null}
          </>
        ) : (
          <p className="text-base leading-8 whitespace-pre-wrap">{message.text}</p>
        )}
      </div>
    </div>
  );
}
