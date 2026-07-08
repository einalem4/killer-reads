import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { getDb } from '../../db/client.js';
import { comments } from '../../db/schema.js';
import { requireAuth } from '../../lib/session.js';

export const commentsApiRoutes = new Hono();

commentsApiRoutes.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.select().from(comments);
  return c.json(rows);
});

commentsApiRoutes.post('/', requireAuth(), async (c) => {
  const session = c.get('session');
  const body = await c.req.json();
  const db = getDb(c.env.DB);

  const [created] = await db
    .insert(comments)
    .values({
      comment_text: body.comment_text,
      user_id: session.user_id,
      post_id: Number(body.post_id)
    })
    .returning();

  return c.json(created);
});

commentsApiRoutes.delete('/:id', requireAuth(), async (c) => {
  const session = c.get('session');
  const id = Number(c.req.param('id'));
  const db = getDb(c.env.DB);

  const existing = await db.query.comments.findFirst({ where: eq(comments.id, id) });
  if (!existing) return c.json({ message: 'No comment found with this id!' }, 404);
  if (existing.user_id !== session.user_id) return c.json({ message: 'Forbidden' }, 403);

  const [deleted] = await db.delete(comments).where(eq(comments.id, id)).returning({ id: comments.id });
  return c.json(deleted);
});
