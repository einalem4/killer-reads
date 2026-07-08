import { getSignedCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import { getDb } from '../db/client.js';
import { sessions } from '../db/schema.js';

const COOKIE_NAME = 'session_id';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 1 day, matches the original express-session maxAge

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(c, user) {
  const db = getDb(c.env.DB);
  const id = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({
    id,
    user_id: user.id,
    username: user.username,
    email: user.email,
    expires_at: expiresAt
  });

  await setSignedCookie(c, COOKIE_NAME, id, c.env.SESSION_SECRET, {
    httpOnly: true,
    secure: c.req.url.startsWith('https://'),
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000
  });

  c.set('session', { sessionId: id, user_id: user.id, username: user.username, email: user.email });
}

export async function loadSession(c) {
  const id = await getSignedCookie(c, c.env.SESSION_SECRET, COOKIE_NAME);
  if (!id) return null;

  const db = getDb(c.env.DB);
  const row = await db.query.sessions.findFirst({ where: eq(sessions.id, id) });
  if (!row) return null;

  if (row.expires_at.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return null;
  }

  return { sessionId: row.id, user_id: row.user_id, username: row.username, email: row.email };
}

export async function destroySession(c) {
  const session = c.get('session');
  if (session) {
    const db = getDb(c.env.DB);
    await db.delete(sessions).where(eq(sessions.id, session.sessionId));
    c.set('session', null);
  }
  deleteCookie(c, COOKIE_NAME, { path: '/' });
}

export async function sessionMiddleware(c, next) {
  c.set('session', await loadSession(c));
  await next();
}

// Equivalent to the original utils/auth.js withAuth middleware, adapted to Hono's
// middleware signature (Express's (req, res, next) doesn't apply to Hono handlers).
export function requireAuth() {
  return async (c, next) => {
    if (!c.get('session')) {
      return c.redirect('/login');
    }
    await next();
  };
}
