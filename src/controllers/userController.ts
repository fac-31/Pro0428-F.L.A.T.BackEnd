import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

export async function createUser(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { name, email } = req.body;

    const { data, error } = await supabase
      .from('Users')
      .insert([{ name, email }])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    next?.(err);
  }
}
