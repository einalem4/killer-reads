import { Hono } from 'hono';
import { getDb } from '../db/client.js';
import { listPostsByUser, getPostById, getOwnedPost } from '../db/queries.js';
import { requireAuth } from '../lib/session.js';
import { renderPage } from '../lib/render.js';

export const userProfileRoutes = new Hono();

userProfileRoutes.get('/', requireAuth(), async (c) => {
  const session = c.get('session');
  const db = getDb(c.env.DB);
  const posts = await listPostsByUser(db, session.user_id);
  return c.html(renderPage('user-profile', { posts, user: session.username, loggedIn: true }));
});

userProfileRoutes.get('/edit-post/:id', requireAuth(), async (c) => {
  const session = c.get('session');
  const db = getDb(c.env.DB);
  const id = Number(c.req.param('id'));

  const owned = await getOwnedPost(db, id, session.user_id);
  if (!owned) return c.body(null, 404);

  const post = await getPostById(db, id, session.user_id);
  if (!post) return c.body(null, 404);

  return c.html(renderPage('edit-post', { post, loggedIn: true }));
});

userProfileRoutes.get('/images', (c) => {
  if (!c.get('session')) return c.redirect('/login');
  return c.html(renderPage('images', { loggedIn: true }));
});
