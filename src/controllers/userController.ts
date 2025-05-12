import { Request, Response } from 'express';

export async function getUsers(_req: Request, res: Response) {
  try {
    res.json({ message: 'Hello from getUsers!' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Message:', error.message);
    } else {
      console.error('Unknown error thrown:', error);
    }
  }
}
