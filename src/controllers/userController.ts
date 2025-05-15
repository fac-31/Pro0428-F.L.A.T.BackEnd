import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient.ts';

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body;

  const { data, error } = await supabase.from('Users').insert([{ name, email }]).select();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }

  res.status(201).json(data);

  // try {
  //   res.json({ message: 'Hello from getUsers!' });
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.error('Message:', error.message);
  //   } else {
  //     console.error('Unknown error thrown:', error);
  //   }
  // }
}
