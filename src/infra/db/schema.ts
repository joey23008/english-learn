import { pgTable, timestamp, serial, varchar, integer, text, foreignKey, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  password: varchar('password', { length: 255 }).notNull().default(''),
  email: varchar('email', { length: 255 }).notNull().default(''),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  lesson_id: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  parent_id: integer('parent_id'),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
}, (table) => {
  return {
    parentReference: foreignKey({
      columns: [table.parent_id],
      foreignColumns: [table.id],
    })
    .onDelete('cascade'),
  };
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  user_number: varchar('user_number', { length: 255 }).notNull().default(''),
  lesson_id: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  chapter_id: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const sentences = pgTable('sentences', {
  id: serial('id').primaryKey(),
  content: text('content').notNull().default(''),
  answer: text('answer').notNull().default(''),
  lesson_id: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  question_id: integer('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const phrases = pgTable('phrases', {
  id: serial('id').primaryKey(),
  en: varchar('en', { length: 255 }).notNull().default(''),
  jp: varchar('jp', { length: 255 }).notNull().default(''),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const questionsPhrases = pgTable('questions_phrases', {
  id: serial('id').primaryKey(),
  lesson_id: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  question_id: integer('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  phrase_id: integer('phrase_id').references(() => phrases.id, { onDelete: 'cascade' }).notNull(),
  priority: integer('priority').notNull().default(0),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
}, (t) => ({
  unq: unique().on(t.question_id, t.phrase_id),
}));

export const responses = pgTable('responses', {
  id: serial('id').primaryKey(),
  lesson_id: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull().default(''),
  sentence_id: integer('sentence_id').references(() => sentences.id, { onDelete: 'cascade' }).notNull().unique(),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const lessonSentences = pgTable('lesson_sentences', {
  id: serial('id').primaryKey(),
  lesson_id: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  number: integer('number').notNull().default(0),
  chapter_id: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }).unique(),
  question_id: integer('question_id').references(() => questions.id, { onDelete: 'cascade' }).unique(),
  owner: integer('owner').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
}, (t) => ({
  unq: unique().on(t.lesson_id, t.number),
}));