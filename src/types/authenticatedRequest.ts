import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    house_id: string;

  };
}