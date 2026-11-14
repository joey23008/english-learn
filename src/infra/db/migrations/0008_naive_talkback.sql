ALTER TABLE "lesson_sentences" ADD COLUMN "owner" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_sentences" ADD CONSTRAINT "lesson_sentences_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
