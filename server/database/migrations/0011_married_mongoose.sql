CREATE INDEX "account_deletions_user_id_index" ON "account_deletions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_items_user_id_index" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_items_product_id_index" ON "cart_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "email_verification_user_id_index" ON "email_verification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "oauth_accounts_user_id_index" ON "oauth_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_index" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_id_index" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_index" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "password_resets_user_id_index" ON "password_resets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "product_files_product_id_index" ON "product_files" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_prices_product_id_index" ON "product_prices" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_translations_product_id_index" ON "product_translations" USING btree ("product_id");