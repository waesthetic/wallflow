DROP INDEX "oauth_accounts_provider_provider_account_id_index";--> statement-breakpoint
CREATE INDEX "account_deletions_token_index" ON "account_deletions" USING btree ("token");--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_provider_provider_account_id_unique" UNIQUE("provider","provider_account_id");