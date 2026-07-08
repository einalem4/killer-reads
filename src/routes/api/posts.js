import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { getDb } from '../../db/client.js';
import { posts, votes } from '../../db/schema.js';
import { requireAuth } from '../../lib/session.js';
import { listAllPostsAscending, getPostById } from '../../db/queries.js';

export const postsApiRoutes = new Hono();

postsApiRoutes.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const rows = await listAllPostsAscending(db);
  return c.json(rows);
});

postsApiRoutes.get('/:id', async (c) => {
  const db = getDb(c.env.DB);
  const id = Number(c.req.param('id'));
  const post = await getPostById(db, id);
  if (!post) return c.json({ message: 'No post found with this id' }, 404);
  return c.json(post);
});

postsApiRoutes.post('/', requireAuth(), async (c) => {
  const session = c.get('session');
  const body = await c.req.json();
  const db = getDb(c.env.DB);

  const [created] = await db
    .insert(posts)
    .values({
      title: body.title,
      author: body.author,
      post_text: body.post_text ?? null,
      user_id: session.user_id,
      genre_id: body.genre_id ?? null
    })
    .returning();

  return c.json(created);
});

postsApiRoutes.put('/upvote', requireAuth(), async (c) => {
  const session = c.get('session');
  const body = await c.req.json();
  const db = getDb(c.env.DB);

  await db.insert(votes).values({ user_id: session.user_id, post_id: Number(body.post_id) });
  const updated = await getPostById(db, Number(body.post_id), session.user_id);

  if (!updated) return c.json({ message: 'No post found with this id' }, 404);
  return c.json(updated);
});

postsApiRoutes.put('/:id', requireAuth(), async (c) => {
  const session = c.get('session');
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  const db = getDb(c.env.DB);

  const updates = { updated_at: new Date() };
  if (body.title !== undefined) updates.title = body.title;
  if (body.author !== undefined) updates.author = body.author;
  if (body.post_text !== undefined) updates.post_text = body.post_text;
  if (body.genre_id !== undefined) updates.genre_id = body.genre_id;

  const [updated] = await db
    .update(posts)
    .set(updates)
    .where(and(eq(posts.id, id), eq(posts.user_id, session.user_id)))
    .returning();

  if (!updated) return c.json({ message: 'No post found with this id' }, 404);
  return c.json(updated);
});

postsApiRoutes.delete('/:id', requireAuth(), async (c) => {
  const session = c.get('session');
  const id = Number(c.req.param('id'));
  const db = getDb(c.env.DB);

  const [deleted] = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.user_id, session.user_id)))
    .returning({ id: posts.id });

  if (!deleted) return c.json({ message: 'No post found with this id' }, 404);
  return c.json(deleted);
});
