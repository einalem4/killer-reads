import { eq, and, asc } from 'drizzle-orm';
import { posts } from './schema.js';

const postWith = {
  user: { columns: { username: true } },
  genre: { columns: { id: true, name: true } },
  comments: {
    with: { user: { columns: { username: true } } }
  },
  votes: { columns: { id: true } }
};

function toPostViewModel(row, currentUserId) {
  const { votes, ...rest } = row;
  return {
    ...rest,
    vote_count: votes?.length ?? 0,
    isMine: currentUserId != null ? row.user_id === currentUserId : false
  };
}

export async function listAllPosts(db, currentUserId) {
  const rows = await db.query.posts.findMany({ with: postWith });
  return rows.map((r) => toPostViewModel(r, currentUserId));
}

export async function listAllPostsAscending(db) {
  const rows = await db.query.posts.findMany({ with: postWith, orderBy: [asc(posts.created_at)] });
  return rows.map((r) => toPostViewModel(r));
}

export async function listPostsByGenre(db, genreId, currentUserId) {
  const rows = await db.query.posts.findMany({ where: eq(posts.genre_id, genreId), with: postWith });
  return rows.map((r) => toPostViewModel(r, currentUserId));
}

export async function listPostsByUser(db, userId) {
  const rows = await db.query.posts.findMany({ where: eq(posts.user_id, userId), with: postWith });
  return rows.map((r) => toPostViewModel(r, userId));
}

export async function getPostById(db, id, currentUserId) {
  const row = await db.query.posts.findFirst({ where: eq(posts.id, id), with: postWith });
  return row ? toPostViewModel(row, currentUserId) : null;
}

export async function getOwnedPost(db, id, userId) {
  return db.query.posts.findFirst({ where: and(eq(posts.id, id), eq(posts.user_id, userId)) });
}
