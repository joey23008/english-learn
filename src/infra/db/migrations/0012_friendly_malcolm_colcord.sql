ALTER TABLE "chapters" RENAME COLUMN "parrent_id" TO "parent_id";--> statement-breakpoint
ALTER TABLE "lesson_sentences" RENAME COLUMN "parrent_id" TO "parent_id";--> statement-breakpoint
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_parrent_id_chapters_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson_sentences" DROP CONSTRAINT "lesson_sentences_parrent_id_chapters_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_parent_id_chapters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_parent_id_chapters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
