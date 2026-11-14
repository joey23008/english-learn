ALTER TABLE "lesson_sentences" ADD COLUMN "parrent_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_parrent_id_chapters_id_fk" FOREIGN KEY ("parrent_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_parrent_id_unique" UNIQUE("parrent_id");