export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
}

export type StepType = 'form' | 'ai_step';

export interface Step {
  id: string;
  title: string;
  description?: string;
  type: StepType;
  // Form specific
  fields?: Field[];
  // AI specific
  action?: string;
  prompt?: string;
  persist?: boolean;
  display?: boolean;
  loadingMessage?: string;
}

export interface Trail {
  trailId: string;
  title: string;
  description?: string;
  steps: Step[];
}

export interface TrailState {
  currentStepIndex: number;
  data: Record<string, any>;
  completed: boolean;
}

export interface TrailSession {
  [trailId: string]: TrailState;
}
