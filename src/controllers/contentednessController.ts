import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

interface ContentednessData {
  user_id: string;
  house_id: string;
  how_happy_are_you: number;
}

// Create a new survey submission
export async function createContentedness(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { user_id, house_id, how_happy_are_you }: ContentednessData = req.body;

    if (!user_id || !house_id || how_happy_are_you === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, house_id, how_happy_are_you',
      });
      return;
    }

    const { data, error } = await supabase
      .from('Contentedness')
      .insert([
        {
          user_id,
          house_id,
          how_happy_are_you,
        },
      ])
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
