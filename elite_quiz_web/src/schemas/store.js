// Redux Store Schemas
import { z } from 'zod';

// Temp Data Schema
export const TempDataSchema = z.object({
  data: z.record(z.any()).default({}),
  contestLeaderboarddata: z.record(z.any()).default({}),
  playwithfrienddata: z.record(z.any()).default({}),
  examQuestionData: z.array(z.any()).default([]),
  examCompletedata: z.object({
    totalQuestions: z.number().nullable(),
    Correctanswer: z.number().nullable(),
    InCorrectanswer: z.number().nullable(),
  }).default({
    totalQuestions: null,
    Correctanswer: null,
    InCorrectanswer: null
  }),
  examsetQuiz: z.object({
    remianingtimer: z.number().nullable(),
    statistics: z.any().nullable(),
    totalmarks: z.string().default('')
  }).default({
    remianingtimer: null,
    statistics: null,
    totalmarks: ''
  }),
  resultTempData: z.record(z.any()).default({}),
  questionsData: z.array(z.any()).default([]),
  quizZoneCompletedata: z.object({
    Correctanswer: z.number().nullable(),
    InCorrectanswer: z.number().nullable()
  }).default({
    Correctanswer: null,
    InCorrectanswer: null
  }),
  reviewAnswerShow: z.boolean().default(false),
  quizShow: z.boolean().default(false),
  percentage: z.number().default(0),
  funandlearnComphremsionData: z.record(z.any()).default({}),
  randomBattleBackToBackWin: z.number().default(0),
  selectedCategory: z.record(z.any()).default({}),
  selectedSubCategory: z.record(z.any()).default({}),
  quizResultData: z.record(z.any()).default({})
});

// Quiz State Schema
export const QuizStateSchema = z.object({
  currentQuestion: z.number().default(0),
  score: z.number().default(0),
  showScore: z.boolean().default(false),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
  })).default([]),
  userAnswers: z.array(z.string()).default([]),
  timeRemaining: z.number().default(0),
  isQuizActive: z.boolean().default(false),
});

// User State Schema
export const UserStateSchema = z.object({
  isAuthenticated: z.boolean().default(false),
  user: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    profileUrl: z.string().url().optional(),
    points: z.number().default(0),
    rank: z.number().default(0),
    level: z.number().default(1),
  }).optional(),
  loading: z.boolean().default(false),
  error: z.string().optional(),
}); 