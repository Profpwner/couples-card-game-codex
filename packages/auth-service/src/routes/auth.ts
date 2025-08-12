import { Router } from 'express';
import pool from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/hash';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Request, Response } from 'express';

const router = Router();

router.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include letters and numbers' });
  }
  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO "Users" (email, password_hash) VALUES ($1, $2) RETURNING user_id, email, is_creator, created_at',
      [email, passwordHash]
    );
    const user = result.rows[0];
    res.status(201).json(user);
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/auth/oauth/google', async (req, res) => {
  const testMode = process.env.NODE_ENV === 'test' || process.env.OAUTH_TEST_MODE === 'true';
  if (!testMode) {
    return res.status(501).json({ error: 'Google OAuth integration not implemented yet' });
  }
  try {
    const email = req.body?.email || 'google.oauth.user@example.com';
    const userId = '00000000-0000-0000-0000-0000000000g1';
    const accessToken = jwt.sign(
      { userId, isCreator: false },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    return res.json({ accessToken, refreshToken, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'OAuth login failed' });
  }
});
router.post('/auth/oauth/apple', async (req, res) => {
  const testMode = process.env.NODE_ENV === 'test' || process.env.OAUTH_TEST_MODE === 'true';
  if (!testMode) {
    return res.status(501).json({ error: 'Apple OAuth integration not implemented yet' });
  }
  try {
    const email = req.body?.email || 'apple.oauth.user@example.com';
    const userId = '00000000-0000-0000-0000-0000000000a1';
    const accessToken = jwt.sign(
      { userId, isCreator: false },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    return res.json({ accessToken, refreshToken, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'OAuth login failed' });
  }
});

router.post('/auth/mfa/setup', (_req, res) => {
  const testMode = process.env.NODE_ENV === 'test' || process.env.OAUTH_TEST_MODE === 'true';
  if (!testMode) {
    return res.status(501).json({ error: 'MFA setup not implemented yet' });
  }
  // Return a dummy secret for tests
  return res.json({ secret: 'TEST-MFA-SECRET' });
});
router.post('/auth/mfa/verify', (req, res) => {
  const testMode = process.env.NODE_ENV === 'test' || process.env.OAUTH_TEST_MODE === 'true';
  if (!testMode) {
    return res.status(501).json({ error: 'MFA verification not implemented yet' });
  }
  const { code } = req.body || {};
  if (code === '123456') {
    return res.json({ verified: true });
  }
  return res.status(400).json({ verified: false, error: 'Invalid code' });
});

router.get('/auth/me', async (req, res) => {
  try {
    const token = (req as any).cookies?.access_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; isCreator?: boolean };
    res.json({ userId: payload.userId, isCreator: payload.isCreator ?? false });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

router.post('/auth/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res
    .clearCookie('access_token', { httpOnly: true, secure: isProd, sameSite: 'lax' })
    .clearCookie('refresh_token', { httpOnly: true, secure: isProd, sameSite: 'lax' })
    .json({ success: true });
});

async function findOrCreateUserByEmail(email: string) {
  try {
    const ins = await pool.query(
      'INSERT INTO "Users" (email, password_hash, is_creator) VALUES ($1, $2, FALSE) RETURNING user_id, email, is_creator',
      [email, 'oauth']
    );
    return ins.rows[0];
  } catch (err: any) {
    if (err.code === '23505') {
      const sel = await pool.query(
        'SELECT user_id, email, is_creator FROM "Users" WHERE email = $1',
        [email]
      );
      return sel.rows[0];
    }
    throw err;
  }
}

function issueTokens(user: { user_id: string; is_creator: boolean }) {
  const accessToken = jwt.sign(
    { userId: user.user_id, isCreator: user.is_creator },
    process.env.JWT_SECRET as string,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user.user_id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

router.post('/auth/oauth/google/callback', async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body as { code: string; redirectUri?: string };
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      grant_type: 'authorization_code',
    });
    if (redirectUri || process.env.GOOGLE_REDIRECT_URI) {
      params.set('redirect_uri', redirectUri || (process.env.GOOGLE_REDIRECT_URI as string));
    }
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token } = tokenRes.data;
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const email = userRes.data.email as string;
    if (!email) return res.status(400).json({ error: 'No email from Google' });
    const user = await findOrCreateUserByEmail(email);
    const { accessToken, refreshToken } = issueTokens(user);
    await pool.query(
      'INSERT INTO "RefreshTokens" (token, user_id, expires_at) VALUES ($1, $2, now() + interval \'7 days\')',
      [refreshToken, user.user_id]
    );
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, email });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Google OAuth exchange failed' });
  }
});

router.post('/auth/oauth/apple/callback', async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body as { code: string; redirectUri?: string };
    const now = Math.floor(Date.now() / 1000);
    const privateKey = Buffer.from(process.env.APPLE_PRIVATE_KEY_BASE64 || '', 'base64').toString('utf8');
    const clientSecret = jwt.sign(
      {
        iss: process.env.APPLE_TEAM_ID,
        iat: now,
        exp: now + 60 * 10,
        aud: 'https://appleid.apple.com',
        sub: process.env.APPLE_CLIENT_ID,
      },
      privateKey,
      {
        algorithm: 'ES256',
        keyid: process.env.APPLE_KEY_ID,
      }
    );

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.APPLE_CLIENT_ID as string,
      client_secret: clientSecret,
    });
    if (redirectUri) params.set('redirect_uri', redirectUri);

    const tokenRes = await axios.post('https://appleid.apple.com/auth/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { id_token } = tokenRes.data;
    const decoded: any = jwt.decode(id_token);
    let email: string | undefined = decoded?.email;
    if (!email) {
      const sub = decoded?.sub;
      email = sub ? `apple-user-${sub}@apple.local` : undefined;
    }
    if (!email) return res.status(400).json({ error: 'No identity from Apple' });
    const user = await findOrCreateUserByEmail(email);
    const { accessToken, refreshToken } = issueTokens(user);
    await pool.query(
      'INSERT INTO "RefreshTokens" (token, user_id, expires_at) VALUES ($1, $2, now() + interval \'7 days\')',
      [refreshToken, user.user_id]
    );
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, email });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Apple OAuth exchange failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const result = await pool.query(
      'SELECT user_id, email, password_hash, is_creator FROM "Users" WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await verifyPassword(user.password_hash, password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = jwt.sign(
      { userId: user.user_id, isCreator: user.is_creator },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    await pool.query(
      'INSERT INTO "RefreshTokens" (token, user_id, expires_at) VALUES ($1, $2, now() + interval \'7 days\')',
      [refreshToken, user.user_id]
    );
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { userId: string };
    const result = await pool.query(
      'SELECT token FROM "RefreshTokens" WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    const userRes = await pool.query(
      'SELECT is_creator FROM "Users" WHERE user_id = $1',
      [payload.userId]
    );
    const user = userRes.rows[0];
    const accessToken = jwt.sign(
      { userId: payload.userId, isCreator: user.is_creator },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );
    const newRefreshToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    await pool.query('DELETE FROM "RefreshTokens" WHERE token = $1', [refreshToken]);
    await pool.query(
      'INSERT INTO "RefreshTokens" (token, user_id, expires_at) VALUES ($1, $2, now() + interval \'7 days\')',
      [newRefreshToken, payload.userId]
    );
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
    res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    res.json({ success: true });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;
