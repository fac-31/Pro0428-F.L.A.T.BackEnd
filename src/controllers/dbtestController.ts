import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

export async function testDBConnection(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Supabase error:', error);
      res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    next?.(err);
  }
}
