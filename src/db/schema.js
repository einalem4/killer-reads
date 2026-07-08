import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const genres = sqliteTable('genre', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name')
});

export const users = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  club_id: integer('club_id'),
  password: text('password').notNull(),
  reset_token: text('reset_token')
});

export const posts = sqliteTable('post', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  author: text('author').notNull(),
  genre_id: integer('genre_id').references(() => genres.id),
  post_text: text('post_text'),
  user_id: integer('user_id').references(() => users.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export const comments = sqliteTable('comment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  comment_text: text('comment_text').notNull(),
  user_id: integer('user_id').notNull().references(() => users.id),
  post_id: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export const votes = sqliteTable('vote', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull().references(() => users.id),
  post_id: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' })
});

// File uploads live in R2 (see IMAGES_BUCKET binding); this table only keeps metadata + the R2 key.
export const images = sqliteTable('image', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  r2_key: text('r2_key'),
  url: text('url'),
  user_id: integer('user_id').references(() => users.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

// Server-side session store, looked up by the id carried in the signed session cookie.
export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  username: text('username').notNull(),
  email: text('email').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  votes: many(votes),
  images: many(images)
}));

export const genresRelations = relations(genres, ({ many }) => ({
  posts: many(posts)
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.user_id], references: [users.id] }),
  genre: one(genres, { fields: [posts.genre_id], references: [genres.id] }),
  comments: many(comments),
  votes: many(votes)
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.user_id], references: [users.id] }),
  post: one(posts, { fields: [comments.post_id], references: [posts.id] })
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, { fields: [votes.user_id], references: [users.id] }),
  post: one(posts, { fields: [votes.post_id], references: [posts.id] })
}));

export const imagesRelations = relations(images, ({ one }) => ({
  user: one(users, { fields: [images.user_id], references: [users.id] })
}));
