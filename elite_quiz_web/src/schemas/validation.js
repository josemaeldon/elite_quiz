// Form Validation Schemas
import { z } from 'zod';

// Login Form Schema
export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Registration Form Schema
export const RegistrationFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Create Room Form Schema
export const CreateRoomFormSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  entryFee: z.number().min(0, 'Entry fee must be 0 or greater'),
  roomCode: z.string().optional(),
  languageId: z.string().min(1, 'Language is required'),
});

// Profile Update Form Schema
export const ProfileUpdateFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  profileUrl: z.string().url().optional(),
});

// Question Form Schema
export const QuestionFormSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters'),
  options: z.array(z.string()).min(2, 'At least 2 options are required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().optional(),
  marks: z.number().min(1, 'Marks must be at least 1'),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  level: z.number().min(1, 'Level must be at least 1'),
  languageId: z.string().min(1, 'Language is required'),
}); 