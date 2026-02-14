// Use Case types
export type QuestionType = "text" | "textarea" | "select" | "multiselect" | "number";

export type UseCaseCategory = "health" | "work" | "lifestyle" | "personal";

export interface UseCaseQuestion {
  id: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
  required: boolean;
  min?: number;
  max?: number;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: UseCaseCategory;
  category_label: string;
  questions: UseCaseQuestion[];
  systemPrompt: string;
}

// Wizard state
export interface WizardState {
  useCaseId: string;
  currentStep: number;
  answers: Record<string, string | string[] | number>;
  result: string | null;
  isGenerating: boolean;
  error: string | null;
}

// Session (completed use case)
export interface Session {
  id: string;
  user_id: string;
  use_case_id: string;
  answers: Record<string, string | string[] | number>;
  result: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  created_at: string;
}

// API types
export interface GenerateRequest {
  useCaseId: string;
  answers: Record<string, string | string[] | number>;
}

export interface GenerateResponse {
  result: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  sessionId?: string | null;
}

export interface SessionsResponse {
  sessions: Session[];
}

// Category for filtering
export interface Category {
  id: string;
  label: string;
  icon: string;
}
