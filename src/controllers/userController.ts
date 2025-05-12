import { Request, Response } from 'express';
//import { supabase } from '../config/supabaseClient';

export async function createUser(_req: Request, res: Response) {
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
