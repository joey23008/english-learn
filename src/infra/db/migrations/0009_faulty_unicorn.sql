ALTER TABLE "questions_phrases" ADD COLUMN "lesson_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "lesson_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sentences" ADD COLUMN "lesson_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_phrases" ADD CONSTRAINT "questions_phrases_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sentences" ADD CONSTRAINT "sentences_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_chapter_id_unique" UNIQUE("chapter_id");--> statement-breakpoint
ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_question_id_unique" UNIQUE("question_id");--> statement-breakpoint
ALTER TABLE "questions_phrases" ADD CONSTRAINT "questions_phrases_question_id_phrase_id_unique" UNIQUE("question_id","phrase_id");--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_sentence_id_unique" UNIQUE("sentence_id");