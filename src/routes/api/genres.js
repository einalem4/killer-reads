import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { getDb } from '../../db/client.js';
import { genres } from '../../db/schema.js';

export const genresApiRoutes = new Hono();

genresApiRoutes.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.select().from(genres);
  return c.json(rows);
});

genresApiRoutes.get('/:id', async (c) => {
  const db = getDb(c.env.DB);
  const id = Number(c.req.param('id'));
  const row = await db.query.genres.findFirst({ where: eq(genres.id, id) });
  return c.json(row ?? null);
});

genresApiRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const [created] = await db.insert(genres).values({ name: body.name }).returning();
  return c.json(created);
});
