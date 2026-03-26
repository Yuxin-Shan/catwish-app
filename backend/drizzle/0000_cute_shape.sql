CREATE TYPE "public"."analysis_source" AS ENUM('camera', 'gallery', 'history');--> statement-breakpoint
CREATE TYPE "public"."analysis_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('app_opened', 'analysis_requested', 'analysis_completed', 'meme_generated', 'history_viewed');--> statement-breakpoint
CREATE TABLE "analysis_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"pet_id" uuid,
	"source" "analysis_source" DEFAULT 'camera' NOT NULL,
	"image_storage_key" text NOT NULL,
	"status" "analysis_status" DEFAULT 'pending' NOT NULL,
	"failure_reason" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "analysis_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_request_id" uuid NOT NULL,
	"emotion" varchar(64) NOT NULL,
	"emotion_score" integer NOT NULL,
	"confidence" integer,
	"cat_says" text NOT NULL,
	"behavior_analysis" text NOT NULL,
	"interaction_suggestion" text,
	"meme_text" text,
	"meme_category" varchar(64),
	"raw_provider_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"user_agent" text,
	"ip_address" varchar(64),
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meme_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"analysis_result_id" uuid,
	"asset_url" text NOT NULL,
	"style" varchar(64),
	"text_overlay" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"breed" varchar(120),
	"birth_date" timestamp with time zone,
	"photo_url" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"event_type" "event_type" NOT NULL,
	"session_id" varchar(120),
	"properties" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text,
	"display_name" varchar(120),
	"avatar_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analysis_requests" ADD CONSTRAINT "analysis_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_requests" ADD CONSTRAINT "analysis_requests_pet_id_pet_profiles_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_analysis_request_id_analysis_requests_id_fk" FOREIGN KEY ("analysis_request_id") REFERENCES "public"."analysis_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_refresh_tokens" ADD CONSTRAINT "auth_refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_assets" ADD CONSTRAINT "meme_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_assets" ADD CONSTRAINT "meme_assets_analysis_result_id_analysis_results_id_fk" FOREIGN KEY ("analysis_result_id") REFERENCES "public"."analysis_results"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_profiles" ADD CONSTRAINT "pet_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analysis_requests_user_id_idx" ON "analysis_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "analysis_requests_pet_id_idx" ON "analysis_requests" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "analysis_requests_status_idx" ON "analysis_requests" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "analysis_results_analysis_request_id_unique_idx" ON "analysis_results" USING btree ("analysis_request_id");--> statement-breakpoint
CREATE INDEX "auth_refresh_tokens_user_id_idx" ON "auth_refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_refresh_tokens_token_hash_unique_idx" ON "auth_refresh_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "meme_assets_user_id_idx" ON "meme_assets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "meme_assets_analysis_result_id_idx" ON "meme_assets" USING btree ("analysis_result_id");--> statement-breakpoint
CREATE INDEX "pet_profiles_user_id_idx" ON "pet_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_events_user_id_idx" ON "user_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_events_event_type_idx" ON "user_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "user_events_occurred_at_idx" ON "user_events" USING btree ("occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique_idx" ON "users" USING btree ("email");