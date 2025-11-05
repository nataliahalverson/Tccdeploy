/**
 * Middleware: Autenticação via JWT (cookie httpOnly)
 * Reaproveitado do backend existente para nova pasta dedicada.
 */

import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieName = process.env.COOKIE_NAME || 'access_token';
  const token = req.cookies?.[cookieName];

  if (!token) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch (error) {
    res.status(401).json({ message: 'invalid token' });
  }
}
