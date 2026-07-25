import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'cognicraft_secret_key_2026_super_secure_jwt_key_32_chars';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyJwtToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Continue if token format is unverified
  }
  next();
};
