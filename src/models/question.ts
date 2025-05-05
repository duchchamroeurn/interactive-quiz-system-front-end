import type { Option } from '@/models/option';

export interface Question {
  id: string;
  questionText: string;
  time: number;
}

export interface QuestionWithOptions extends Question {
  options: Option[];
}
