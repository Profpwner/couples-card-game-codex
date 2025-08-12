import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  isCreator?: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    let token: string | undefined;
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.slice('Bearer '.length);
    } else if ((req as any).cookies?.access_token) {
      token = (req as any).cookies.access_token;
    }
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const secret = process.env.JWT_SECRET as string;
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.user = payload;
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
