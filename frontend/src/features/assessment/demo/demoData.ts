import type { Assessment } from "@/features/assessment/types/assessment.types";
import type { Dimension } from "@/features/dimensions/types/dimension.types";
import type { Question } from "@/features/questions/types/question.types";
import type { Sector } from "@/features/sectors/types/sector.types";
import type { Subdimension } from "@/features/subdimensions/types/subdimension.types";

export const demoSectors: Sector[] = [
  {
    id: 1,
    name: "Retail",
    code: "RETAIL",
    description: null,
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: "Banking",
    code: "BANKING",
    description: null,
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    name: "Insurance",
    code: "INSURANCE",
    description: null,
    display_order: 3,
    is_active: true,
  },
  {
    id: 4,
    name: "Telecom",
    code: "TELECOM",
    description: null,
    display_order: 4,
    is_active: true,
  },
];

export const demoDimensions: Dimension[] = [
  {
    id: 1,
    name: "Company profile",
    code: "PROFILE",
    description:
      "A short first page that helps tailor the rest of the assessment to your business context.",
    weight: 100,
    display_order: 1,
    is_active: true,
  },
];

export const demoSubdimensions: Subdimension[] = [
  {
    id: 11,
    dimension_id: 1,
    name: "Assessment context",
    code: "PROFILE.01",
    description:
      "Initial profiling information used to shape the assessment experience.",
    weight: 100,
    display_order: 1,
    is_active: true,
  },
];

export const demoQuestions: Question[] = [
  {
    id: 1001,
    sector_id: 0,
    subdimension_id: 11,
    question_text: "Which area is currently the biggest focus for your team?",
    helper_text: "Choose the area that best reflects your current priority.",
    answer_type: "single_select",
    is_mandatory: true,
    is_scored: false,
    scoring_strategy: "none",
    weight: null,
    display_order: 1,
    is_active: true,
    display_rules: [],
    options: [
      {
        option_label: "Customer journey redesign",
        option_value: "journey_redesign",
        score: null,
        maturity_level: null,
        display_order: 1,
        is_active: true,
      },
      {
        option_label: "Operational efficiency",
        option_value: "operational_efficiency",
        score: null,
        maturity_level: null,
        display_order: 2,
        is_active: true,
      },
      {
        option_label: "Digital self-service",
        option_value: "digital_self_service",
        score: null,
        maturity_level: null,
        display_order: 3,
        is_active: true,
      },
      {
        option_label: "Measurement and governance",
        option_value: "measurement_governance",
        score: null,
        maturity_level: null,
        display_order: 4,
        is_active: true,
      },
    ],
  },
  {
    id: 1002,
    sector_id: 0,
    subdimension_id: 11,
    question_text: "How would you describe your current customer experience maturity?",
    helper_text: "This helps position the starting point for the rest of the assessment.",
    answer_type: "single_select",
    is_mandatory: true,
    is_scored: false,
    scoring_strategy: "none",
    weight: null,
    display_order: 2,
    is_active: true,
    display_rules: [],
    options: [
      {
        option_label: "Early stage",
        option_value: "early_stage",
        score: null,
        maturity_level: null,
        display_order: 1,
        is_active: true,
      },
      {
        option_label: "Developing",
        option_value: "developing",
        score: null,
        maturity_level: null,
        display_order: 2,
        is_active: true,
      },
      {
        option_label: "Established",
        option_value: "established",
        score: null,
        maturity_level: null,
        display_order: 3,
        is_active: true,
      },
      {
        option_label: "Advanced",
        option_value: "advanced",
        score: null,
        maturity_level: null,
        display_order: 4,
        is_active: true,
      },
    ],
  },
  {
    id: 1003,
    sector_id: 0,
    subdimension_id: 11,
    question_text: "Which teams are most involved in customer experience decisions today?",
    helper_text: "Select all that apply.",
    answer_type: "multi_select",
    is_mandatory: true,
    is_scored: false,
    scoring_strategy: "none",
    weight: null,
    display_order: 3,
    is_active: true,
    display_rules: [],
    options: [
      {
        option_label: "Customer experience",
        option_value: "cx_team",
        score: null,
        maturity_level: null,
        display_order: 1,
        is_active: true,
      },
      {
        option_label: "Operations",
        option_value: "operations",
        score: null,
        maturity_level: null,
        display_order: 2,
        is_active: true,
      },
      {
        option_label: "Digital / product",
        option_value: "digital_product",
        score: null,
        maturity_level: null,
        display_order: 3,
        is_active: true,
      },
      {
        option_label: "Technology / data",
        option_value: "technology_data",
        score: null,
        maturity_level: null,
        display_order: 4,
        is_active: true,
      },
      {
        option_label: "Leadership team",
        option_value: "leadership",
        score: null,
        maturity_level: null,
        display_order: 5,
        is_active: true,
      },
    ],
  },
  {
    id: 1004,
    sector_id: 0,
    subdimension_id: 11,
    question_text: "What would you most like this assessment to help you clarify?",
    helper_text: "Optional: add a short note for the demo discussion.",
    answer_type: "text_area",
    is_mandatory: false,
    is_scored: false,
    scoring_strategy: "none",
    weight: null,
    display_order: 4,
    is_active: true,
    display_rules: [],
    options: [],
  },
];

type DemoAssessmentInput = {
  assessmentId: number;
  companyName: string | null;
  respondentName: string | null;
  respondentEmail: string | null;
  respondentRoleTitle: string | null;
  sectorId: number | null;
};

export function createDemoAssessment({
  assessmentId,
  companyName,
  respondentName,
  respondentEmail,
  respondentRoleTitle,
  sectorId,
}: DemoAssessmentInput): Assessment {
  return {
    id: assessmentId,
    company_name: companyName,
    respondent_name: respondentName,
    respondent_email: respondentEmail,
    respondent_role_title: respondentRoleTitle,
    sector_id: sectorId,
    status: "in_progress",
    overall_score: null,
    maturity_level: null,
  };
}
