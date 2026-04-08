CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
CREATE INDEX "email_verification_token_index" ON "email_verification" USING btree ("token");--> statement-breakpoint
CREATE INDEX "oauth_accounts_provider_provider_account_id_index" ON "oauth_accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "password_resets_token_index" ON "password_resets" USING btree ("token");--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_product_id_unique" UNIQUE("user_id","product_id");