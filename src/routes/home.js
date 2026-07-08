import { Hono } from 'hono';
import { renderPage } from '../lib/render.js';

export const homeRoutes = new Hono();

homeRoutes.get('/', (c) => {
  const session = c.get('session');
  return c.html(renderPage('landing', { loggedIn: !!session }));
});

homeRoutes.get('/login', (c) => {
  if (c.get('session')) return c.redirect('/discussions');
  return c.html(renderPage('login', {}));
});

homeRoutes.get('/forgot-password', (c) => {
  if (c.get('session')) return c.redirect('/');
  return c.html(renderPage('forgot-password', {}));
});

homeRoutes.get('/reset-password', (c) => {
  if (c.get('session')) return c.redirect('/');
  return c.html(renderPage('reset-password', {}));
});

homeRoutes.get('/signup', (c) => {
  if (c.get('session')) return c.redirect('/discussions');
  return c.html(renderPage('signup', {}));
});
