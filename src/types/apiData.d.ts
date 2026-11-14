declare module 'ApiDataTypes' {
  export type User = {
    id: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string,
  }
  export type UserCount = {
    count: number,
  }
  export type Lesson = {
    id: number,
    name: string,
    created_at: string,
    updated_at: string,
    owner: number,
  }
  export type Chapter = {
    id: number,
    name: string,
    lesson_id: number,
    parent_id: number | null,
    created_at: string,
    updated_at: string,
    owner: number,
  }
  export type Question = {
    id: number,
    lesson_id: number,
    created_at: string,
    updated_at: string,
    owner: number,
    chapter_id: number | null,
    user_number: string,
  }
  export type Sentence = {
    id: number,
    content: string,
    answer: string,
    question_id: number,
    created_at: string,
    updated_at: string,
    owner: number,
    lesson_id: number,
  }
  export type QuestionsPhrase = {
    id: number,
    question_id: number,
    phrase_id: number,
    priority: number,
    created_at: string,
    updated_at: string,
    owner: number,
    lesson_id: number,
  }
  export type Phrase = {
    id: number,
    en: string,
    jp: string,
    created_at: string,
    updated_at: string,
    owner: number,
  }
  export type Response = {
    id: number,
    content: string,
    sentence_id: number,
    created_at: string,
    updated_at: string,
    owner: number,
    lesson_id: number,
  }
  export type OrderedSentences = {
    lesson_sentence_id: number,
    chapter_id: number | null,
    number: number,
    chapter_name: string | null,
    question_id: number | null,
    user_number: string | null,
    parent: number | null,
    sentences: Sentence[],
    phrases: (Phrase & {
      qs_ph_id: number,
      priority: number,
    })[],
    children?: OrderedSentences[],
  }
}