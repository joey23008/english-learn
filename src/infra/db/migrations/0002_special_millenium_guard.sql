ALTER TABLE "chapters" RENAME COLUMN "user_id" TO "owner";--> statement-breakpoint
ALTER TABLE "lessons" RENAME COLUMN "user_id" TO "owner";--> statement-breakpoint
ALTER TABLE "phrases" RENAME COLUMN "user_id" TO "owner";--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "user_id" TO "owner";--> statement-breakpoint
ALTER TABLE "questions_phrases" RENAME COLUMN "user_id" TO "owner";--> statement-breakpoint
ALTER TABLE "sentences" RENAME COLUMN "user_id" TO "owner";--> statement-breakpoint
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "phrases" DROP CONSTRAINT "phrases_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "questions_phrases" DROP CONSTRAINT "questions_phrases_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sentences" DROP CONSTRAINT "sentences_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phrases" ADD CONSTRAINT "phrases_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions_phrases" ADD CONSTRAINT "questions_phrases_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sentences" ADD CONSTRAINT "sentences_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
