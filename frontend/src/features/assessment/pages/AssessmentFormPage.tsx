import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssessment, submitAssessment } from "@/features/assessment/api/assessmentApi";
import { getQuestions } from "@/features/questions/api/questionsApi";
import { AssessmentChatComposer } from "@/features/assessment/components/AssessmentChatComposer";
import { AssessmentChatMessage } from "@/features/assessment/components/AssessmentChatMessage";
import { AssessmentChatProgress } from "@/features/assessment/components/AssessmentChatProgress";
import { AssessmentQuickReplies } from "@/features/assessment/components/AssessmentQuickReplies";
import type {
  Assessment,
  AssessmentAnswerSubmit,
  AssessmentChatMessage as AssessmentChatMessageType,
  AssessmentChatProgress as AssessmentChatProgressType,
  AssessmentPendingContext,
  AssessmentChatSelectedAnswer,
  AssessmentPendingTransition,
  AssessmentStoredAnswer,
} from "@/features/assessment/types/assessment.types";
import type { AnswerOption, Question } from "@/features/questions/types/question.types";
import { LoaderCircle } from "lucide-react";

const WELCOME_MESSAGE =
  "Welcome. I’ll guide you through the CX maturity assessment one question at a time and adapt the flow based on your answers. We'll start with the assessment questions, then collect some profiling information at the end.";
const BOT_TYPING_DELAY_MS = 1000;
const DEFAULT_COMPANY_PLACEHOLDER = "Pending profile";

const QUESTION_CONTEXT_BY_CODE: Record<string, string> = {
  Q1: "How priorities are set often says a lot about how customer-focused an organization really is. Let’s start there.",
  Q5: "Strong organizations do more than collect feedback, they use it. Let’s look at how that happens here.",
  Q7: "The customer journey helps bring the experience to life by showing the moments that matter most. Let’s explore how you look at it today.",
  Q10: "Pain points are part of every experience; what matters most is how they are handled. Let’s look at what usually happens here.",
  Q11: "Real improvement is not just about making changes, but knowing whether they worked.",
};
const PROFILING_QUESTIONS = [
  {
    id: 10001,
    question_code: "PROFILE_COMPANY",
    question_text: "Before we finish, what is your company name?",
    answer_type: "text_area",
    helper_text: "Enter your organization name",
    is_profiling: true,
  },
  {
    id: 10002,
    question_code: "PROFILE_NAME",
    question_text: "What is your full name?",
    answer_type: "text_area",
    helper_text: "Enter your full name",
    is_profiling: true,
  },
  {
    id: 10003,
    question_code: "PROFILE_EMAIL",
    question_text: "What is your work email?",
    answer_type: "text_area",
    helper_text: "Enter your work email",
    is_profiling: true,
  },
  {
    id: 10004,
    question_code: "PROFILE_ROLE",
    question_text: "What is your role or title?",
    answer_type: "text_area",
    helper_text: "Enter your role or title",
    is_profiling: true,
  },
  {
    id: 10005,
    question_code: "PROFILE_SECTOR",
    question_text: "Which sector does your organization operate in?",
    answer_type: "single_select",
    helper_text: "Choose the sector that best fits your organization",
    is_profiling: true,
    options: [
      {
        id: 100051,
        option_label: "Financial Services",
        option_value: "financial_services",
        option_code: "FIN_SERV",
        display_order: 1,
        is_active: true,
      },
      {
        id: 100052,
        option_label: "Government & Public Sector",
        option_value: "government_public",
        option_code: "GPS",
        display_order: 2,
        is_active: true,
      },
      {
        id: 100053,
        option_label: "Health & Life Sciences",
        option_value: "health_life_sciences",
        option_code: "HLS",
        display_order: 3,
        is_active: true,
      },
      {
        id: 100054,
        option_label: "Consumer",
        option_value: "consumer",
        option_code: "CONSUMER",
        display_order: 4,
        is_active: true,
      },
      {
        id: 100055,
        option_label: "Technology, Media & Telecommunications",
        option_value: "tmt",
        option_code: "TMT",
        display_order: 5,
        is_active: true,
      },
      {
        id: 100056,
        option_label: "Energy & Resources",
        option_value: "energy_resources",
        option_code: "E&R",
        display_order: 6,
        is_active: true,
      },
      {
        id: 100057,
        option_label: "Industrial Products",
        option_value: "industrial_products",
        option_code: "IP",
        display_order: 7,
        is_active: true,
      },
      {
        id: 100058,
        option_label: "Real Estate, Hospitality & Construction",
        option_value: "real_estate_hospitality_construction",
        option_code: "REHC",
        display_order: 8,
        is_active: true,
      },
      {
        id: 100059,
        option_label: "Other",
        option_value: "other",
        option_code: "OTHER",
        display_order: 9,
        is_active: true,
      },
    ],
  },
] as const;

function sortQuestions(input: Question[]) {
  return [...input].sort((a, b) => {
    const aAxisId = a.axis_id ?? 0;
    const bAxisId = b.axis_id ?? 0;
    const aIsAssessment = aAxisId >= 1 && aAxisId <= 3;
    const bIsAssessment = bAxisId >= 1 && bAxisId <= 3;

    if (aIsAssessment && !bIsAssessment) return -1;
    if (!aIsAssessment && bIsAssessment) return 1;

    if (aIsAssessment && bIsAssessment) {
      const axisA = a.axis_id ?? 0;
      const axisB = b.axis_id ?? 0;
      const orderA = a.display_order ?? 0;
      const orderB = b.display_order ?? 0;

      if (axisA !== axisB) return axisA - axisB;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id;
    }

    const orderA = a.display_order ?? 0;
    const orderB = b.display_order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });
}

function createMessageId(prefix: string, key?: string | number) {
  return key == null ? prefix : `${prefix}-${key}`;
}

function getQuestionProgress(
  questionId: number | null,
  questions: Question[],
  finished: boolean,
): AssessmentChatProgressType {
  const assessmentQuestions = questions.filter((q) => {
    const axisId = q.axis_id ?? 0;
    return axisId >= 1 && axisId <= 3;
  });

  const total = assessmentQuestions.length;

  if (total === 0) {
    return {
      current: 0,
      total: 0,
      percentage: 0,
      label: "Question 0 of 0",
    };
  }

  if (finished) {
    return {
      current: total,
      total,
      percentage: 100,
      label: `Question ${total} of ${total}`,
    };
  }

  const currentIndex = questionId
    ? assessmentQuestions.findIndex((question) => question.id === questionId)
    : -1;
  const current = Math.max(1, currentIndex + 1);

  return {
    current,
    total,
    percentage: (current / total) * 100,
    label: `Question ${current} of ${total}`,
  };
}

function getActiveOptions(question: Question) {
  return question.options
    .filter((option) => option.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

function formatUserAnswer(answer: AssessmentStoredAnswer) {
  if (answer.answerText) return answer.answerText;
  if (answer.optionLabels.length > 0) return answer.optionLabels.join(", ");
  return "Skipped";
}

function getQuestionContext(question: Question | null | undefined) {
  if (!question) return null;
  if (question.context_text?.trim()) return question.context_text.trim();
  const key = question.question_code ?? `Q${question.id}`;
  return QUESTION_CONTEXT_BY_CODE[key] ?? null;
}

function transitionIntroducesQuestion(
  previousAnswer: AssessmentStoredAnswer | null,
  questionId: number,
) {
  if (!previousAnswer?.transitionText) return false;
  return previousAnswer.nextQuestionId === questionId;
}

function buildMessageHistory({
  includeWelcome,
  assessment,
  path,
  answers,
  currentQuestionId,
  questionsById,
  finished,
  pendingTransition,
  pendingContext,
  revealedContextQuestionIds,
}: {
  includeWelcome: boolean;
  assessment: Assessment | null;
  path: number[];
  answers: Record<number, AssessmentStoredAnswer>;
  currentQuestionId: number | null;
  questionsById: Record<number, Question>;
  finished: boolean;
  pendingTransition: AssessmentPendingTransition | null;
  pendingContext: AssessmentPendingContext | null;
  revealedContextQuestionIds: number[];
}): AssessmentChatMessageType[] {
  const messages: AssessmentChatMessageType[] = includeWelcome
    ? [
        {
          id: createMessageId("welcome", "intro"),
          type: "assistant_text",
          text:
            assessment?.company_name &&
            assessment.company_name !== DEFAULT_COMPANY_PLACEHOLDER
              ? `${WELCOME_MESSAGE} We’re assessing ${assessment.company_name}.`
              : WELCOME_MESSAGE,
          createdAt: 1,
        },
      ]
    : [];

  path.forEach((questionId) => {
    const question = questionsById[questionId];
    if (!question) return;

    const previousQuestionIndex = path.indexOf(questionId) - 1;
    const previousQuestionId =
      previousQuestionIndex >= 0 ? path[previousQuestionIndex] : undefined;
    const previousAnswer = previousQuestionId
      ? answers[previousQuestionId]
      : null;
    const questionAlreadyAskedInTransition = transitionIntroducesQuestion(
      previousAnswer ?? null,
      question.id,
    );
    const questionContext = getQuestionContext(question);
    const answer = answers[question.id];
    const shouldShowQuestionBubble =
      currentQuestionId === question.id || Boolean(answer);

    if (previousAnswer?.transitionText) {
      messages.push({
        id: createMessageId("transition", previousQuestionId),
        type: "assistant_text",
        text: previousAnswer.transitionText,
        createdAt: messages.length + 1,
        questionId: previousQuestionId,
      });
    }

    if (questionContext && revealedContextQuestionIds.includes(question.id)) {
      messages.push({
        id: createMessageId("context", question.id),
        type: "assistant_text",
        text: questionContext,
        createdAt: messages.length + 1,
        questionId: question.id,
      });
    }

    if (!questionAlreadyAskedInTransition && shouldShowQuestionBubble) {
      messages.push({
        id: createMessageId("question", question.id),
        type: "assistant_question",
        text: question.question_text,
        createdAt: messages.length + 1,
        questionId: question.id,
        questionCode: question.question_code ?? `Q${question.id}`,
        helperText: question.helper_text,
      });
    }

    if (answer) {
      messages.push({
        id: createMessageId("answer", question.id),
        type: "user_answer",
        text: formatUserAnswer(answer),
        createdAt: messages.length + 1,
        questionId: question.id,
      });
    }
  });

  if (pendingTransition?.transitionText) {
    messages.push({
      id: createMessageId("pending", pendingTransition.questionId),
      type: "assistant_text",
      text: pendingTransition.transitionText,
      createdAt: messages.length + 1,
      questionId: pendingTransition.questionId,
    });
  }

  if (pendingContext?.contextText) {
    messages.push({
      id: createMessageId("pending-context", pendingContext.questionId),
      type: "assistant_text",
      text: pendingContext.contextText,
      createdAt: messages.length + 1,
      questionId: pendingContext.questionId,
    });
  }

  if (finished) {
    messages.push({
      id: createMessageId("complete", "done"),
      type: "assistant_text",
      text: "We’ve reached the end of the guided assessment. Submit when you’re ready to generate your scores and recommendations.",
      createdAt: messages.length + 1,
    });
  }

  return messages;
}

export default function AssessmentFormPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, AssessmentStoredAnswer>>({});
  const [path, setPath] = useState<number[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] =
    useState<AssessmentChatSelectedAnswer>(null);
  const [messageHistory, setMessageHistory] = useState<AssessmentChatMessageType[]>(
    [],
  );
  const [progress, setProgress] = useState<AssessmentChatProgressType>({
    current: 0,
    total: 0,
    percentage: 0,
    label: "Question 0 of 0",
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [pendingTransition, setPendingTransition] =
    useState<AssessmentPendingTransition | null>(null);
  const [pendingContext, setPendingContext] =
    useState<AssessmentPendingContext | null>(null);
  const [revealedContextQuestionIds, setRevealedContextQuestionIds] = useState<
    number[]
  >([]);
  const [composerValue, setComposerValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const sortedQuestions = useMemo(() => {
  const baseQuestions = sortQuestions(questions);
  return [...baseQuestions, ...PROFILING_QUESTIONS];
}, [questions]);
  const questionsById = useMemo(
    () =>
      Object.fromEntries(
        sortedQuestions.map((question) => [question.id, question]),
      ) as Record<number, Question>,
    [sortedQuestions],
  );

  const finished =
    currentQuestionId === null &&
    !isTyping &&
    path.length > 0 &&
    sortedQuestions
      .filter((q) => {
        const axisId = q.axis_id ?? 0;
        return axisId >= 1 && axisId <= 3;
      })
      .every((question) => Boolean(answers[question.id]));

  const currentQuestion = currentQuestionId ? questionsById[currentQuestionId] : null;

  const clearTypingTimeouts = () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  const waitForDelay = (delayMs: number) =>
    new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(resolve, delayMs);
      timeoutsRef.current.push(timeoutId);
    });

  const waitForPaint = () =>
    new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });

  const stopTypingIndicator = () => {
    setIsTyping(false);
    setShowTypingIndicator(false);
  };

  const syncConversation = ({
    nextPath,
    nextAnswers,
    nextCurrentQuestionId,
    nextPendingTransition,
    nextFinished,
    nextHasShownWelcome,
    assessmentOverride,
    questionsOverride,
    nextPendingContext,
    nextRevealedContextQuestionIds,
  }: {
    nextPath: number[];
    nextAnswers: Record<number, AssessmentStoredAnswer>;
    nextCurrentQuestionId: number | null;
    nextPendingTransition: AssessmentPendingTransition | null;
    nextFinished: boolean;
    nextHasShownWelcome?: boolean;
    assessmentOverride?: Assessment | null;
    questionsOverride?: Question[];
    nextPendingContext?: AssessmentPendingContext | null;
    nextRevealedContextQuestionIds?: number[];
  }) => {
    const questionsSource = questionsOverride ?? sortedQuestions;
    const questionsSourceById = Object.fromEntries(
      questionsSource.map((question) => [question.id, question]),
    ) as Record<number, Question>;

    setMessageHistory(
      buildMessageHistory({
        includeWelcome: nextHasShownWelcome ?? hasShownWelcome,
        assessment: assessmentOverride ?? assessment,
        path: nextPath,
        answers: nextAnswers,
        currentQuestionId: nextCurrentQuestionId,
        questionsById: questionsSourceById,
        finished: nextFinished,
        pendingTransition: nextPendingTransition,
        pendingContext: nextPendingContext ?? pendingContext,
        revealedContextQuestionIds:
          nextRevealedContextQuestionIds ?? revealedContextQuestionIds,
      }),
    );

    setProgress(
      getQuestionProgress(nextCurrentQuestionId, questionsSource, nextFinished),
    );
  };

  const runAssistantMessageStep = async (
    onReveal: () => void,
    delayMs = BOT_TYPING_DELAY_MS,
  ) => {
    setIsTyping(true);
    setShowTypingIndicator(true);
    await waitForDelay(delayMs);
    stopTypingIndicator();
    onReveal();
    await waitForPaint();
  };

  const setQuestionSelectionState = (questionId: number | null) => {
    if (!questionId) {
      setSelectedAnswer(null);
      return;
    }

    const question = questionsById[questionId];
    if (!question) {
      setSelectedAnswer(null);
      return;
    }

    if (question.answer_type === "multi_select") {
      setSelectedAnswer(answers[questionId]?.optionIds ?? []);
      return;
    }

    if (question.answer_type === "text_area") {
      setSelectedAnswer(answers[questionId]?.answerText ?? "");
      return;
    }

    setSelectedAnswer(answers[questionId]?.optionId ?? null);
  };

  const beginConversation = (
    questionList: Question[],
    assessmentData: Assessment | null,
    useTyping: boolean,
  ) => {
    const firstQuestion = questionList[0];
    const nextPath = firstQuestion ? [firstQuestion.id] : [];

    clearTypingTimeouts();
    setAnswers({});
    setPath(nextPath);
    setHasShownWelcome(false);
    setPendingTransition(null);
    setPendingContext(null);
    setRevealedContextQuestionIds([]);
    setShowTypingIndicator(false);
    setComposerValue("");

    if (!firstQuestion) {
      setCurrentQuestionId(null);
      setSelectedAnswer(null);
      setIsTyping(false);
      setShowTypingIndicator(false);
      syncConversation({
        nextPath: [],
        nextAnswers: {},
        nextCurrentQuestionId: null,
        nextPendingTransition: null,
        nextFinished: false,
        nextHasShownWelcome: false,
        assessmentOverride: assessmentData,
        questionsOverride: questionList,
        nextPendingContext: null,
        nextRevealedContextQuestionIds: [],
      });
      return;
    }

    if (!useTyping) {
      const initialRevealedContextQuestionIds = getQuestionContext(firstQuestion)
        ? [firstQuestion.id]
        : [];

      setHasShownWelcome(true);
      setCurrentQuestionId(firstQuestion.id);
      setSelectedAnswer(
        firstQuestion.answer_type === "multi_select"
          ? []
          : firstQuestion.answer_type === "text_area"
            ? ""
            : null,
      );
      setIsTyping(false);
      setShowTypingIndicator(false);
      setRevealedContextQuestionIds(initialRevealedContextQuestionIds);

      syncConversation({
        nextPath,
        nextAnswers: {},
        nextCurrentQuestionId: firstQuestion.id,
        nextPendingTransition: null,
        nextFinished: false,
        nextHasShownWelcome: true,
        assessmentOverride: assessmentData,
        questionsOverride: questionList,
        nextPendingContext: null,
        nextRevealedContextQuestionIds: initialRevealedContextQuestionIds,
      });
      return;
    }

    const firstQuestionContext = getQuestionContext(firstQuestion);

    const revealFirstQuestion = () => {
      const revealedContextIds = firstQuestionContext ? [firstQuestion.id] : [];
      setCurrentQuestionId(firstQuestion.id);
      setSelectedAnswer(
        firstQuestion.answer_type === "multi_select"
          ? []
          : firstQuestion.answer_type === "text_area"
            ? ""
            : null,
      );
      setPendingContext(null);
      setRevealedContextQuestionIds(revealedContextIds);

      syncConversation({
        nextPath,
        nextAnswers: {},
        nextCurrentQuestionId: firstQuestion.id,
        nextPendingTransition: null,
        nextFinished: false,
        nextHasShownWelcome: true,
        assessmentOverride: assessmentData,
        questionsOverride: questionList,
        nextPendingContext: null,
        nextRevealedContextQuestionIds: revealedContextIds,
      });
    };

    setCurrentQuestionId(null);
    setSelectedAnswer(null);

    syncConversation({
      nextPath: [],
      nextAnswers: {},
      nextCurrentQuestionId: null,
      nextPendingTransition: null,
      nextFinished: false,
      nextHasShownWelcome: false,
      assessmentOverride: assessmentData,
      questionsOverride: questionList,
      nextPendingContext: null,
      nextRevealedContextQuestionIds: [],
    });

    const revealWelcome = () => {
      setHasShownWelcome(true);
      syncConversation({
        nextPath: [],
        nextAnswers: {},
        nextCurrentQuestionId: null,
        nextPendingTransition: null,
        nextFinished: false,
        nextHasShownWelcome: true,
        assessmentOverride: assessmentData,
        questionsOverride: questionList,
        nextPendingContext: null,
        nextRevealedContextQuestionIds: [],
      });
    };

    const startConversationSequence = async () => {
      await runAssistantMessageStep(revealWelcome);

      if (firstQuestionContext) {
        await runAssistantMessageStep(() => {
          const nextPendingContext = {
            questionId: firstQuestion.id,
            contextText: firstQuestionContext,
          };
          setPendingContext(nextPendingContext);
          syncConversation({
            nextPath: [],
            nextAnswers: {},
            nextCurrentQuestionId: null,
            nextPendingTransition: null,
            nextFinished: false,
            nextHasShownWelcome: true,
            assessmentOverride: assessmentData,
            questionsOverride: questionList,
            nextPendingContext,
            nextRevealedContextQuestionIds: [],
          });
        });

        revealFirstQuestion();
        return;
      }

      revealFirstQuestion();
    };

    void startConversationSequence();
  };

  useEffect(() => {
    async function loadForm() {
      if (!assessmentId) return;

      try {
        setLoading(true);
        const [assessmentData, questionData] = await Promise.all([
          getAssessment(Number(assessmentId)),
          getQuestions(),
        ]);
        const normalizedQuestions = questionData.filter((question) => question.is_active);
        setAssessment(assessmentData);
        setQuestions(normalizedQuestions);
        beginConversation(sortQuestions(normalizedQuestions), assessmentData, true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load assessment");
      } finally {
        setLoading(false);
      }
    }

    void loadForm();

    return () => clearTypingTimeouts();
  }, [assessmentId]);

  const nextSequentialQuestionId = (questionId: number) => {
    const index = sortedQuestions.findIndex((question) => question.id === questionId);
    const nextQuestion = index >= 0 ? sortedQuestions[index + 1] : null;
    return nextQuestion?.id ?? null;
  };

  const resolveNextStep = (question: Question, selectedOptionIds: number[]) => {
    const matchedRule = question.display_rules
      ?.filter((rule) => rule.is_active)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .find(
        (rule) =>
          rule.expected_option_id != null &&
          selectedOptionIds.includes(rule.expected_option_id),
      );

    return {
      nextQuestionId: matchedRule?.next_question_id ?? nextSequentialQuestionId(question.id),
      transitionText: matchedRule?.transition_text ?? null,
    };
  };

  const moveToQuestion = (
    nextQuestionId: number | null,
    nextAnswers: Record<number, AssessmentStoredAnswer>,
    transitionText: string | null,
    sourceQuestionId: number,
  ) => {
    clearTypingTimeouts();
    setComposerValue("");
    setCurrentQuestionId(null);
    setSelectedAnswer(null);
    setShowTypingIndicator(false);
    setPendingContext(null);
    setPendingTransition(null);

    syncConversation({
      nextPath: path,
      nextAnswers,
      nextCurrentQuestionId: null,
      nextPendingTransition: null,
      nextFinished: false,
      nextHasShownWelcome: hasShownWelcome,
      nextPendingContext: null,
    });

    const nextPath = nextQuestionId
      ? [...path.filter((id) => id !== nextQuestionId), nextQuestionId]
      : path;
    const nextQuestion = nextQuestionId ? questionsById[nextQuestionId] : null;
    const nextQuestionContext = getQuestionContext(nextQuestion);

    const nextRevealedContextQuestionIds =
      nextQuestionId && nextQuestionContext
        ? [
            ...revealedContextQuestionIds.filter((id) => id !== nextQuestionId),
            nextQuestionId,
          ]
        : revealedContextQuestionIds;

    const revealQuestion = () => {
      const isFinished = nextQuestionId === null;

      setPath(nextPath);
      setPendingTransition(null);
      setPendingContext(null);
      setRevealedContextQuestionIds(nextRevealedContextQuestionIds);
      setCurrentQuestionId(nextQuestionId);

      if (nextQuestionId) {
        const targetQuestion = questionsById[nextQuestionId];
        if (targetQuestion?.answer_type === "multi_select") {
          setSelectedAnswer([]);
        } else if (targetQuestion?.answer_type === "text_area") {
          setSelectedAnswer("");
        } else {
          setSelectedAnswer(null);
        }
      } else {
        setSelectedAnswer(null);
      }

      syncConversation({
        nextPath,
        nextAnswers,
        nextCurrentQuestionId: nextQuestionId,
        nextPendingTransition: null,
        nextFinished: isFinished,
        nextHasShownWelcome: hasShownWelcome,
        nextPendingContext: null,
        nextRevealedContextQuestionIds: nextRevealedContextQuestionIds,
      });
    };

    const revealContextStage = () => {
      setPendingTransition(null);
      setCurrentQuestionId(null);

      const nextPendingContext = nextQuestionContext
        ? {
            questionId: nextQuestionId ?? 0,
            contextText: nextQuestionContext,
          }
        : null;

      setPendingContext(nextPendingContext);

      syncConversation({
        nextPath: path,
        nextAnswers,
        nextCurrentQuestionId: null,
        nextPendingTransition: null,
        nextFinished: false,
        nextHasShownWelcome: hasShownWelcome,
        nextPendingContext,
        nextRevealedContextQuestionIds: revealedContextQuestionIds,
      });
    };

    const runNextSequence = async () => {
      if (transitionText) {
        await runAssistantMessageStep(() => {
          const interimPendingTransition = {
            questionId: sourceQuestionId,
            nextQuestionId,
            transitionText,
          };
          setPendingTransition(interimPendingTransition);
          syncConversation({
            nextPath: path,
            nextAnswers,
            nextCurrentQuestionId: null,
            nextPendingTransition: interimPendingTransition,
            nextFinished: false,
            nextHasShownWelcome: hasShownWelcome,
            nextPendingContext: null,
            nextRevealedContextQuestionIds: revealedContextQuestionIds,
          });
        });
      }

      if (nextQuestionContext) {
        await runAssistantMessageStep(revealContextStage, BOT_TYPING_DELAY_MS);
      }

      setPendingTransition(null);
      setPendingContext(null);
      revealQuestion();
    };

    void runNextSequence();
  };

  const submitResponse = ({
    question,
    optionIds,
    optionLabels,
    optionCodes,
    answerText,
  }: {
    question: Question;
    optionIds: number[];
    optionLabels: string[];
    optionCodes?: string[];
    answerText: string | null;
  }) => {
    const { nextQuestionId, transitionText } = resolveNextStep(question, optionIds);

    const nextAnswer: AssessmentStoredAnswer = {
      questionId: question.id,
      optionId: optionIds.length === 1 ? optionIds[0] : null,
      optionIds,
      optionLabels,
      optionCodes: optionCodes ?? [],
      answerText,
      transitionText,
      nextQuestionId,
    };

    const nextAnswers = {
      ...answers,
      [question.id]: nextAnswer,
    };

    setAnswers(nextAnswers);
    moveToQuestion(nextQuestionId, nextAnswers, transitionText, question.id);
  };

  const handleSingleSelect = (option: AnswerOption) => {
    if (
      !currentQuestion ||
      option.id == null ||
      currentQuestion.answer_type !== "single_select"
    ) {
      return;
    }

    setSelectedAnswer(option.id);
    requestAnimationFrame(() => {
  bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
});
    submitResponse({
      question: currentQuestion,
      optionIds: [option.id],
      optionLabels: [option.option_label],
      optionCodes: [option.option_code ?? option.option_value],
      answerText: null,
    });
  };

  const handleMultiSelectOption = (option: AnswerOption) => {
    if (
      !currentQuestion ||
      option.id == null ||
      currentQuestion.answer_type !== "multi_select"
    ) {
      return;
    }

    const currentSelection = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    const nextSelection = currentSelection.includes(option.id)
      ? currentSelection.filter((selectedId) => selectedId !== option.id)
      : [...currentSelection, option.id];

    setSelectedAnswer(nextSelection);
    requestAnimationFrame(() => {
  bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
});
  };


  const submitMultiSelectAnswer = () => {
    if (!currentQuestion || currentQuestion.answer_type !== "multi_select") return;

    const selectedOptionIds = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    if (selectedOptionIds.length === 0) return;

    const selectedOptions = getActiveOptions(currentQuestion).filter(
      (option) => option.id != null && selectedOptionIds.includes(option.id),
    );

    submitResponse({
      question: currentQuestion,
      optionIds: selectedOptionIds,
      optionLabels: selectedOptions.map((option) => option.option_label),
      optionCodes: selectedOptions.map(
        (option) => option.option_code ?? option.option_value,
      ),
      answerText: null,
    });
  };

  const handleBack = () => {
    if (isTyping) return;
    if (path.length <= 1) return;

    const previousQuestionId = path[path.length - 2];
    const activeQuestionId = path[path.length - 1];
    const nextPath = path.slice(0, -1);
    const nextAnswers = { ...answers };

    delete nextAnswers[activeQuestionId];

    setAnswers(nextAnswers);
    setPath(nextPath);
    setCurrentQuestionId(previousQuestionId);
    setPendingTransition(null);
    setIsTyping(false);
    setShowTypingIndicator(false);
    setPendingContext(null);

    const nextRevealedContextQuestionIds = revealedContextQuestionIds.filter((id) =>
      nextPath.includes(id),
    );

    setRevealedContextQuestionIds(nextRevealedContextQuestionIds);
    setComposerValue("");

    syncConversation({
      nextPath,
      nextAnswers,
      nextCurrentQuestionId: previousQuestionId,
      nextPendingTransition: null,
      nextFinished: false,
      nextHasShownWelcome: hasShownWelcome,
      nextPendingContext: null,
      nextRevealedContextQuestionIds: nextRevealedContextQuestionIds,
    });

    const previousQuestion = questionsById[previousQuestionId];
    if (previousQuestion?.answer_type === "multi_select") {
      setSelectedAnswer(nextAnswers[previousQuestionId]?.optionIds ?? []);
    } else if (previousQuestion?.answer_type === "text_area") {
      setSelectedAnswer(nextAnswers[previousQuestionId]?.answerText ?? "");
    } else {
      setSelectedAnswer(nextAnswers[previousQuestionId]?.optionId ?? null);
    }
  };

  const handleRestart = () => {
    if (sortedQuestions.length === 0) return;
    beginConversation(sortedQuestions, assessment, true);
  };

  const handleComposerSend = () => {
    if (isTyping) return;

    const rawValue = composerValue.trim();
    if (!rawValue) return;

    const command = rawValue.toLowerCase();

    if (command === "back") {
      handleBack();
      setComposerValue("");
      return;
    }

    if (command === "restart") {
      handleRestart();
      return;
    }

    if (!currentQuestion) return;

    if (command === "next") {
      if (currentQuestion.answer_type === "text_area") {
        if (currentQuestion.is_mandatory) return;

        submitResponse({
          question: currentQuestion,
          optionIds: [],
          optionLabels: [],
          optionCodes: [],
          answerText: null,
        });
        return;
      }

      if (currentQuestion.answer_type === "multi_select") {
        submitMultiSelectAnswer();
      }
      return;
    }

    submitResponse({
      question: currentQuestion,
      optionIds: [],
      optionLabels: [],
      optionCodes: [],
      answerText: rawValue,
    });
  };

  const handleSubmit = async () => {
    if (!assessmentId) return;

    const payload: AssessmentAnswerSubmit[] = sortedQuestions
      .filter((question) => answers[question.id])
      .map((question) => ({
        question_id: question.id,
        selected_option_id: answers[question.id].optionId,
        selected_option_ids: answers[question.id].optionIds,
        answer_text: answers[question.id].answerText,
      }));

    try {
      setSubmitting(true);
      await submitAssessment(Number(assessmentId), { answers: payload });
      navigate(`/assessment/${assessmentId}/results`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit assessment");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!currentQuestionId) return;
    setQuestionSelectionState(currentQuestionId);
  }, [currentQuestionId]);

  useEffect(() => {
    if (currentQuestionId != null) {
      setShowTypingIndicator(false);
    }
  }, [currentQuestionId]);

  useLayoutEffect(() => {
  const el = scrollRef.current;
  const bottom = bottomRef.current;
  if (!el || !bottom) return;

  requestAnimationFrame(() => {
    bottom.scrollIntoView({
      block: "end",
      behavior: "auto",
    });
  });
}, [messageHistory, currentQuestionId, isTyping, showTypingIndicator, selectedAnswer]);

  useEffect(() => {
    if (
      currentQuestion?.answer_type === "text_area" &&
      typeof selectedAnswer === "string"
    ) {
      setComposerValue(selectedAnswer);
    }
  }, [currentQuestion?.id, currentQuestion?.answer_type, selectedAnswer]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-sm text-[#6B7280]">
        Loading assessment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-sm text-red-600">{error}</div>
    );
  }

  if (!currentQuestion && !finished && !isTyping) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-sm text-red-600">
        No active question found.
      </div>
    );
  }

  const composerPlaceholder =
    currentQuestion?.answer_type === "text_area"
      ? "Type your response..."
      : "Write your answer or use quick replies...";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#F3F8EF_0%,#ECF2E8_42%,#E4ECE0_100%)] px-3 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-5xl flex-col gap-4 md:h-[calc(100vh-3rem)]">
        <AssessmentChatProgress
          companyName={assessment?.company_name}
          progress={progress}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-[#D9E3D2] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(246,250,243,0.98)_100%)] shadow-[0_24px_70px_rgba(26,36,33,0.08)]">
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6"
          >
            <div className="space-y-4">
              {messageHistory.map((message) => (
                <AssessmentChatMessage key={message.id} message={message} />
              ))}

              {isTyping && showTypingIndicator ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#4B5563] shadow-[0_14px_34px_rgba(17,24,39,0.06)]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#C5A04F] [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#C5A04F] [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#C5A04F]" />
                    </div>
                    <span className="font-medium">Assistant is typing</span>
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#98A2B3]" />
                  </div>
                </div>
              ) : null}

              {finished ? (
                <div className="rounded-[1.5rem] border border-[#CFE2CA] bg-[#F5FBF2] p-4">
                  <p className="text-sm font-semibold text-[#244234]">
                    Assessment complete
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#4B6557]">
                    Your responses are ready. Submit now to generate axis scores
                    and recommendations.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-[#B9D2B2] bg-white px-5 text-sm font-semibold text-[#244234]"
                    >
                      Go back one step
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#1A2421] px-5 text-sm font-semibold text-white disabled:opacity-70"
                    >
                      {submitting ? "Generating results..." : "Finish and see results"}
                    </button>
                  </div>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="relative z-10 shrink-0 border-t border-[#DCE5D7] bg-[linear-gradient(180deg,rgba(246,250,243,0)_0%,rgba(246,250,243,0.92)_16%,rgba(255,255,255,0.98)_100%)] backdrop-blur">
            {currentQuestion ? (
              <AssessmentQuickReplies
                question={currentQuestion}
                selectedOptionIds={Array.isArray(selectedAnswer) ? selectedAnswer : []}
                disabled={isTyping}
                onSelectOption={(option) => {
                  if (currentQuestion.answer_type === "single_select") {
                    handleSingleSelect(option);
                    return;
                  }
                  handleMultiSelectOption(option);
                }}
                onSubmitMultiSelect={submitMultiSelectAnswer}
              />
            ) : null}

            <AssessmentChatComposer
              value={composerValue}
              onChange={(value) => {
                setComposerValue(value);
                if (currentQuestion?.answer_type === "text_area") {
                  setSelectedAnswer(value);
                }
              }}
              onSend={handleComposerSend}
              onBack={handleBack}
              onRestart={handleRestart}
              disabled={isTyping || submitting}
              canGoBack={path.length > 1}
              placeholder={composerPlaceholder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}