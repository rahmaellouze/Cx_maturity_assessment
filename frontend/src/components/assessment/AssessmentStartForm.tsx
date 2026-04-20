import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssessment } from "@/features/assessment/api/assessmentApi";

export default function AssessmentStartForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleStartAssessment = async () => {
    setSubmitting(true);

    try {
      const data = await createAssessment({
        company_name: "Pending profile",
        respondent_name: "",
        respondent_email: "",
        respondent_role_title: "",
      });

      navigate(`/assessment/${data.assessment_id}`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleStartAssessment}
      disabled={submitting}
      className="inline-flex min-h-13 items-center justify-center rounded-xl bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? "Starting..." : "Begin assessment"}
    </button>
  );
}
