import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { desc, count, and, eq, gte } from 'drizzle-orm';
import { getDb } from '../../db/client.js';
import { images } from '../../db/schema.js';
import { requireAuth } from '../../lib/session.js';
import helpers from '../../../utils/helpers.cjs';

export const imagesApiRoutes = new Hono();

const DEFAULT_LIST_LIMIT = 24;
const MAX_LIST_LIMIT = 50;

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const DAILY_UPLOAD_QUOTA = 20;

imagesApiRoutes.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const limit = Math.min(Number(c.req.query('limit')) || DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);

  const rows = await db.query.images.findMany({
    orderBy: [desc(images.created_at)],
    with: { user: { columns: { username: true } } },
    limit,
    offset
  });
  return c.json(rows);
});

imagesApiRoutes.post(
  '/',
  bodyLimit({
    maxSize: MAX_UPLOAD_BYTES,
    onError: (c) => c.text(`File too large (max ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB).`, 413)
  }),
  requireAuth(),
  async (c) => {
    const session = c.get('session');

    const { success } = await c.env.UPLOAD_LIMITER.limit({ key: String(session.user_id) });
    if (!success) return c.text('Too many uploads. Please slow down.', 429);

    const body = await c.req.parseBody();
    const file = body.file;

    if (!file || !(file instanceof File)) {
      return c.text('No files were uploaded.', 400);
    }

    // file.type is client-supplied and spoofable
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return c.text('Unsupported file type. Allowed: JPEG, PNG, WebP, GIF.', 400);
    }

    const db = getDb(c.env.DB);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [{ value: uploadCount }] = await db
      .select({ value: count() })
      .from(images)
      .where(and(eq(images.user_id, session.user_id), gte(images.created_at, since)));

    if (uploadCount >= DAILY_UPLOAD_QUOTA) {
      return c.text('Daily upload limit reached. Try again tomorrow.', 429);
    }

    const key = `${session.user_id}/${helpers.randomString(8)}-${file.name}`;
    await c.env.IMAGES_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type }
    });

    await db.insert(images).values({
      name: file.name,
      r2_key: key,
      url: `/uploads/${key}`,
      user_id: session.user_id
    });

    return c.redirect('/user-profile');
  }
);
