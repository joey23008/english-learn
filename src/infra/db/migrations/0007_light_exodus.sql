CREATE TABLE IF NOT EXISTS "lesson_sentences" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"number" integer DEFAULT 0 NOT NULL,
	"chapter_id" integer,
	"question_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_sentences_lesson_id_number_unique" UNIQUE("lesson_id","number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "chapters" DROP COLUMN IF EXISTS "number";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN IF EXISTS "number";