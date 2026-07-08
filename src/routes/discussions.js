import { Hono } from 'hono';
import { getDb } from '../db/client.js';
import { listAllPosts, listPostsByGenre } from '../db/queries.js';
import { renderPage } from '../lib/render.js';

export const discussionsRoutes = new Hono();

discussionsRoutes.get('/', async (c) => {
  const session = c.get('session');
  const db = getDb(c.env.DB);
  const posts = await listAllPosts(db, session?.user_id);
  return c.html(renderPage('discussions', { posts, loggedIn: !!session }));
});

discussionsRoutes.get('/:id', async (c) => {
  const session = c.get('session');
  const db = getDb(c.env.DB);
  const genreId = Number(c.req.param('id'));
  const posts = await listPostsByGenre(db, genreId, session?.user_id);
  return c.html(renderPage('discussions', { posts, loggedIn: !!session }));
});
