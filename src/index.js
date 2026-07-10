import { Hono } from 'hono';
import { sessionMiddleware } from './lib/session.js';
import { homeRoutes } from './routes/home.js';
import { sitePostRoutes } from './routes/site-post.js';
import { apiRoutes } from './routes/api/index.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { discussionsRoutes } from './routes/discussions.js';
import { userProfileRoutes } from './routes/user-profile.js';

const app = new Hono();

app.use('*', sessionMiddleware);

app.get('/uploads/:key{.+}', async (c) => {
  // Serve repeat requests for the same object straight from Cloudflare's edge
  // cache instead of re-reading (and re-billing) R2 on every hit.
  const cache = caches.default;
  const cached = await cache.match(c.req.raw);
  if (cached) return cached;

  const key = c.req.param('key');
  const object = await c.env.IMAGES_BUCKET.get(key);
  if (!object) return c.notFound();

  const response = new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });

  c.executionCtx.waitUntil(cache.put(c.req.raw, response.clone()));
  return response;
});

app.route('/', homeRoutes);
app.route('/', sitePostRoutes);
app.route('/api', apiRoutes);
app.route('/dashboard', dashboardRoutes);
app.route('/discussions', discussionsRoutes);
app.route('/user-profile', userProfileRoutes);

export default app;
