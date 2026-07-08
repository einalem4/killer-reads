import { Hono } from 'hono';
import { renderPage } from '../lib/render.js';

export const dashboardRoutes = new Hono();

dashboardRoutes.get('/', (c) => {
  if (!c.get('session')) return c.redirect('/login');
  return c.html(renderPage('create-post', { loggedIn: true }));
});
