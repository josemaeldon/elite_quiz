// API Response Schemas
import { z } from 'zod';

// Common API Response Schema
export const ApiResponseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  status: z.number(),
  data: z.any(),
});

// Exam Module Schema
export const ExamModuleSchema = z.object({
  exam_module_id: z.string(),
  total_duration: z.number(),
  obtained_marks: z.number(),
  statistics: z.array(z.object({
    mark: z.string(),
    correct_answer: z.string(),
    incorrect: z.string(),
  })),
  rules_violated: z.boolean(),
  captured_question_ids: z.array(z.string()),
});

// Level Data Schema
export const LevelDataSchema = z.object({
  category: z.string(),
  subcategory: z.string().optional(),
  level: z.number(),
});

// Question Schema
export const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correct_answer: z.string(),
  explanation: z.string().optional(),
  marks: z.number().default(1),
  category_id: z.string(),
  subcategory_id: z.string().optional(),
  level: z.number().optional(),
  language_id: z.string(),
});

// Bookmark Schema
export const BookmarkSchema = z.object({
  id: z.string(),
  question_id: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  type: z.string(),
}); 