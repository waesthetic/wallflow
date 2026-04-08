ALTER TABLE "account_delitions" RENAME TO "account_deletions";--> statement-breakpoint
ALTER TABLE "account_deletions" DROP CONSTRAINT "account_delitions_token_unique";--> statement-breakpoint
ALTER TABLE "account_deletions" DROP CONSTRAINT "account_delitions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "account_deletions" ADD CONSTRAINT "account_deletions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_deletions" ADD CONSTRAINT "account_deletions_token_unique" UNIQUE("token");