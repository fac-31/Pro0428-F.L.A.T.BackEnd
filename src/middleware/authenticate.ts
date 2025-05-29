import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

interface JwtPayload {
  sub: string;
  house_id?: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = {
      id: decoded.sub,
      house_id: decoded.house_id ?? '',
    };

    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
