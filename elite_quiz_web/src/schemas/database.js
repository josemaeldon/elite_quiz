// Firebase Database Schemas
import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  profileUrl: z.string().url().optional(),
  points: z.number().default(0),
  correctAnswers: z.number().default(0),
});

// Battle Room Schema
export const BattleRoomSchema = z.object({
  categoryId: z.string(),
  createdAt: z.any(), // Firebase Timestamp
  createdBy: z.string(),
  entryFee: z.number().default(0),
  languageId: z.string(),
  readyToPlay: z.boolean().default(false),
  categoryName: z.string(),
  roomCode: z.string().default(""),
  user1: z.object({
    answers: z.array(z.any()),
    name: z.string(),
    points: z.number().default(0),
    profileUrl: z.string().url().optional(),
    uid: z.string(),
    correctAnswers: z.number().default(0),
  }),
  user2: z.object({
    answers: z.array(z.any()),
    name: z.string().default(""),
    points: z.number().default(0),
    profileUrl: z.string().url().optional().default(""),
    uid: z.string().default(""),
    correctAnswers: z.number().default(0),
  }),
});

// Multi User Battle Room Schema
export const MultiUserBattleRoomSchema = z.object({
  categoryId: z.string(),
  createdAt: z.any(), // Firebase Timestamp
  createdBy: z.string(),
  entryFee: z.number().default(0),
  readyToPlay: z.boolean().default(false),
  categoryName: z.string(),
  roomCode: z.string().default(""),
  user1: z.object({
    answers: z.array(z.any()),
    correctAnswers: z.number().default(0),
    name: z.string(),
    profileUrl: z.string().url().optional(),
    uid: z.string(),
  }),
  user2: z.object({
    answers: z.array(z.any()),
    correctAnswers: z.number().default(0),
    name: z.string().default(""),
    profileUrl: z.string().url().optional().default(""),
    uid: z.string().default(""),
  }),
  user3: z.object({
    answers: z.array(z.any()),
    correctAnswers: z.number().default(0),
    name: z.string().default(""),
    profileUrl: z.string().url().optional().default(""),
    uid: z.string().default(""),
  }),
  user4: z.object({
    answers: z.array(z.any()),
    correctAnswers: z.number().default(0),
    name: z.string().default(""),
    profileUrl: z.string().url().optional().default(""),
    uid: z.string().default(""),
  }),
}); 