// basically sama og categories með breyttum heitum  
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const QuestionSchema = z.object({
  id: z.number(),
  text: z
    .string()
    .min(3, 'text must be at least three letters')
    .max(1024, 'text must be at most 1024 letters'),
});

const QuestionToCreateSchema = z.object({
  text: z
    .string()
    .min(3, 'text must be at least three letters')
    .max(1024, 'text must be at most 1024 letters'),
});

type Question = z.infer<typeof QuestionSchema>;
type QuestionToCreate = z.infer<typeof QuestionToCreateSchema>;

const mockQuestions: Array<Question> = [
  {
    id: 1,
    text: 'What is HTML?',
  },
  {
    id: 2,
    text: 'What is CSS?',
  },
  {
    id: 3,
    text: 'What is JavaScript?',
  },
];

const prisma = new PrismaClient();

export async function getQuestions(
  limit: number = 10,
  offset: number = 0,
): Promise<Array<Question>> {
  const questions = await prisma.questions.findMany();
  console.log('questions :>> ', questions);
  return questions;
}

export function getQuestion(id: number): Question | null {
  const q = mockQuestions.find((q) => q.id === id);
  return q ?? null;
}

export function validateQuestion(questionToValidate: unknown) {
  const result = QuestionToCreateSchema.safeParse(questionToValidate);
  return result;
}

export async function createQuestion(questionToCreate: QuestionToCreate): Promise<Question> {
  const createdQuestion = await prisma.questions.create({
    data: {
      text: questionToCreate.text,
    },
  });
  return createdQuestion;
}

export async function updateQuestion(id: number, questionToCreate: QuestionToCreate): Promise<Question | null> {
  const questions = await prisma.questions.findMany();
  const existing = questions.find((q) => q.id === id);
  if (!existing) {
    return null;
  }
  const updatedQuestion = await prisma.questions.update({
    where: { id: existing.id },
    data: {
      text: questionToCreate.text,
    },
  });
  return updatedQuestion;
}

export async function deleteQuestion(id: number): Promise<boolean> {
  const questions = await prisma.questions.findMany();
  const existing = questions.find((q) => q.id === id);
  if (!existing) {
    return false;
  }
  await prisma.questions.delete({
    where: { id: existing.id },
  });
  return true;
}