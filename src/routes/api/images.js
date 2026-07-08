import { Hono } from 'hono';
import { desc } from 'drizzle-orm';
import { getDb } from '../../db/client.js';
import { images } from '../../db/schema.js';
import { requireAuth } from '../../lib/session.js';
import helpers from '../../../utils/helpers.cjs';

export const imagesApiRoutes = new Hono();

imagesApiRoutes.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.query.images.findMany({
    orderBy: [desc(images.created_at)],
    with: { user: { columns: { username: true } } }
  });
  return c.json(rows);
});

imagesApiRoutes.post('/', requireAuth(), async (c) => {
  const session = c.get('session');
  const body = await c.req.parseBody();
  const file = body.file;

  if (!file || !(file instanceof File)) {
    return c.text('No files were uploaded.', 400);
  }

  const key = `${session.user_id}/${helpers.randomString(8)}-${file.name}`;
  await c.env.IMAGES_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  const db = getDb(c.env.DB);
  await db.insert(images).values({
    name: file.name,
    r2_key: key,
    url: `/uploads/${key}`,
    user_id: session.user_id
  });

  return c.redirect('/user-profile');
});
