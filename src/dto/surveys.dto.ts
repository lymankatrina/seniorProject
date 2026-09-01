export interface CreateSurveyInput {
  surveyLink: string;
  isActive: boolean;
}

export type UpdateSurveyInput =
  Partial<CreateSurveyInput>;
