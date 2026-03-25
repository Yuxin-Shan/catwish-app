import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const analysisStatusEnum = pgEnum('analysis_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const analysisSourceEnum = pgEnum('analysis_source', [
  'camera',
  'gallery',
  'history',
]);

export const eventTypeEnum = pgEnum('event_type', [
  'app_opened',
  'analysis_requested',
  'analysis_completed',
  'meme_generated',
  'history_viewed',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: text('password_hash'),
    displayName: varchar('display_name', { length: 120 }),
    avatarUrl: text('avatar_url'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailUniqueIdx: uniqueIndex('users_email_unique_idx').on(table.email),
  })
);

export const authRefreshTokens = pgTable(
  'auth_refresh_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    userAgent: text('user_agent'),
    ipAddress: varchar('ip_address', { length: 64 }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('auth_refresh_tokens_user_id_idx').on(table.userId),
    tokenHashUniqueIdx: uniqueIndex('auth_refresh_tokens_token_hash_unique_idx').on(table.tokenHash),
  })
);

export const petProfiles = pgTable(
  'pet_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 120 }).notNull(),
    breed: varchar('breed', { length: 120 }),
    birthDate: timestamp('birth_date', { withTimezone: true }),
    photoUrl: text('photo_url'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('pet_profiles_user_id_idx').on(table.userId),
  })
);

export const analysisRequests = pgTable(
  'analysis_requests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    petId: uuid('pet_id').references(() => petProfiles.id, { onDelete: 'set null' }),
    source: analysisSourceEnum('source').notNull().default('camera'),
    imageStorageKey: text('image_storage_key').notNull(),
    status: analysisStatusEnum('status').notNull().default('pending'),
    failureReason: text('failure_reason'),
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => ({
    userIdIdx: index('analysis_requests_user_id_idx').on(table.userId),
    petIdIdx: index('analysis_requests_pet_id_idx').on(table.petId),
    statusIdx: index('analysis_requests_status_idx').on(table.status),
  })
);

export const analysisResults = pgTable(
  'analysis_results',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    analysisRequestId: uuid('analysis_request_id')
      .notNull()
      .references(() => analysisRequests.id, { onDelete: 'cascade' }),
    emotion: varchar('emotion', { length: 64 }).notNull(),
    emotionScore: integer('emotion_score').notNull(),
    confidence: integer('confidence'),
    catSays: text('cat_says').notNull(),
    behaviorAnalysis: text('behavior_analysis').notNull(),
    interactionSuggestion: text('interaction_suggestion'),
    memeText: text('meme_text'),
    memeCategory: varchar('meme_category', { length: 64 }),
    rawProviderPayload: jsonb('raw_provider_payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    analysisRequestIdUniqueIdx: uniqueIndex('analysis_results_analysis_request_id_unique_idx').on(
      table.analysisRequestId
    ),
  })
);

export const memeAssets = pgTable(
  'meme_assets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    analysisResultId: uuid('analysis_result_id').references(() => analysisResults.id, {
      onDelete: 'set null',
    }),
    assetUrl: text('asset_url').notNull(),
    style: varchar('style', { length: 64 }),
    textOverlay: text('text_overlay'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('meme_assets_user_id_idx').on(table.userId),
    analysisResultIdIdx: index('meme_assets_analysis_result_id_idx').on(table.analysisResultId),
  })
);

export const userEvents = pgTable(
  'user_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    eventType: eventTypeEnum('event_type').notNull(),
    sessionId: varchar('session_id', { length: 120 }),
    properties: jsonb('properties'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_events_user_id_idx').on(table.userId),
    eventTypeIdx: index('user_events_event_type_idx').on(table.eventType),
    occurredAtIdx: index('user_events_occurred_at_idx').on(table.occurredAt),
  })
);
