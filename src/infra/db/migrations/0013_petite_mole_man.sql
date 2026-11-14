ALTER TABLE "lesson_sentences" DROP CONSTRAINT "lesson_sentences_parent_id_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson_sentences" DROP COLUMN IF EXISTS "parent_id";