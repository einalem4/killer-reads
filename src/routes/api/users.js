import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { getDb } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import { createSession, destroySession, requireAuth } from '../../lib/session.js';
import { sendEmail } from '../../lib/email.js';
import helpers from '../../../utils/helpers.cjs';

export const usersApiRoutes = new Hono();

usersApiRoutes.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.query.users.findMany({ columns: { password: false } });
  return c.json(rows);
});

usersApiRoutes.get('/:id', async (c) => {
  const db = getDb(c.env.DB);
  const id = Number(c.req.param('id'));

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
    with: {
      posts: { columns: { id: true, title: true, post_text: true, created_at: true } },
      comments: {
        columns: { id: true, comment_text: true, created_at: true },
        with: { post: { columns: { title: true } } }
      },
      votes: { with: { post: { columns: { title: true } } } }
    }
  });

  if (!user) return c.json({ message: 'No user found with this id' }, 404);

  const { votes, ...rest } = user;
  return c.json({ ...rest, voted_posts: votes.map((v) => v.post) });
});

usersApiRoutes.post('/', async (c) => {
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
  const { success } = await c.env.SIGNUP_LIMITER.limit({ key: ip });
  if (!success) {
    return c.json({ message: 'Too many signups from this network. Try again in a minute.' }, 429);
  }

  const body = await c.req.json();
  const db = getDb(c.env.DB);

  const [created] = await db
    .insert(users)
    .values({
      username: body.username,
      email: body.email,
      club_id: body.club_id ?? null,
      password: await hashPassword(body.password)
    })
    .returning({ id: users.id, username: users.username, email: users.email, club_id: users.club_id });

  await createSession(c, created);
  return c.json(created);
});

usersApiRoutes.post('/login', async (c) => {
  const body = await c.req.json();
  const db = getDb(c.env.DB);

  const user = await db.query.users.findFirst({ where: eq(users.email, body.email) });
  if (!user) return c.json({ message: 'No user with that email address!' }, 400);

  const validPassword = await verifyPassword(body.password, user.password);
  if (!validPassword) return c.json({ message: 'Incorrect password!' }, 400);

  await createSession(c, user);
  return c.json({
    user: { id: user.id, username: user.username, email: user.email },
    message: 'You are now logged in!'
  });
});

usersApiRoutes.post('/logout', async (c) => {
  if (!c.get('session')) return c.body(null, 404);
  await destroySession(c);
  return c.body(null, 204);
});

usersApiRoutes.post('/forgot', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const genericMessage = { message: 'If this email exists you should receive an email shortly' };

  if (!body.email) return c.json(genericMessage, 200);

  const db = getDb(c.env.DB);
  const user = await db.query.users.findFirst({ where: eq(users.email, body.email) });
  if (!user) return c.json(genericMessage, 200);

  const reset_token = helpers.randomString();
  await db.update(users).set({ reset_token }).where(eq(users.id, user.id));

  const link = `${c.env.SERVICE_URL}/reset-password?token=${reset_token}`;
  await sendEmail(c.env, {
    to: user.email,
    from: 'killerreadsbookclub@gmail.com',
    subject: 'Killer Reads - Reset Your Password',
    html: `<a href="${link}"> Click here to reset password</a>`
  });

  return c.json(genericMessage, 200);
});

usersApiRoutes.put('/reset-password', async (c) => {
  const body = await c.req.json();

  if (!body.reset_token) return c.json({ message: 'reset token is required' }, 400);
  if (!body.new_password || body.new_password.length < 6) {
    return c.json({ message: 'password must be at least 6 characters' }, 400);
  }

  const db = getDb(c.env.DB);
  const user = await db.query.users.findFirst({ where: eq(users.reset_token, body.reset_token) });
  if (!user) return c.json({ message: 'Invalid reset token' }, 400);

  await db
    .update(users)
    .set({ reset_token: null, password: await hashPassword(body.new_password) })
    .where(eq(users.id, user.id));

  return c.json({ message: 'Your password has been reset' });
});

usersApiRoutes.put('/:id', requireAuth(), async (c) => {
  const session = c.get('session');
  const id = Number(c.req.param('id'));
  if (session.user_id !== id) return c.json({ message: 'Forbidden' }, 403);

  const body = await c.req.json();
  const db = getDb(c.env.DB);

  const updates = {};
  if (body.username) updates.username = body.username;
  if (body.email) updates.email = body.email;
  if (body.password) updates.password = await hashPassword(body.password);

  const [updated] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning({ id: users.id, username: users.username, email: users.email });

  if (!updated) return c.json({ message: 'No user found with this id' }, 404);
  return c.json(updated);
});

usersApiRoutes.delete('/:id', requireAuth(), async (c) => {
  const session = c.get('session');
  const id = Number(c.req.param('id'));
  if (session.user_id !== id) return c.json({ message: 'Forbidden' }, 403);

  const db = getDb(c.env.DB);
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });

  if (!deleted) return c.json({ message: 'No user found with this id' }, 404);
  return c.json(deleted);
});
