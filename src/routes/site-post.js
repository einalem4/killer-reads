import { Hono } from 'hono';
import { getDb } from '../db/client.js';
import { getPostById } from '../db/queries.js';
import { renderPage } from '../lib/render.js';

export const sitePostRoutes = new Hono();

sitePostRoutes.get('/post/:id', async (c) => {
  const session = c.get('session');
  const db = getDb(c.env.DB);
  const id = Number(c.req.param('id'));
  const post = await getPostById(db, id, session?.user_id);

  if (!post) {
    return c.json({ message: 'No post found with this id' }, 404);
  }

  return c.html(renderPage('single-post', { post, loggedIn: !!session }));
});
