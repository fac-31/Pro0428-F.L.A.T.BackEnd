import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

interface TenureData {
  user_id: string;
  house_id: string;
  tenure_start: string;
  tenure_end: string;
  active: boolean;
}

// Create a new tenure
export async function createTenure(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { user_id, house_id, tenure_start, tenure_end, active }: TenureData = req.body;

    if (!user_id || !house_id || !tenure_start || !tenure_end) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, house_id, tenure_start, tenure_end',
      });
      return;
    }

    // Check if the user exists in the Users table
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError || !userData) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check if the house exists in the Houses table
    const { data: houseData, error: houseError } = await supabase
      .from('Houses')
      .select('id')
      .eq('id', house_id)
      .single();

    if (houseError || !houseData) {
      res.status(404).json({ success: false, message: 'House not found' });
      return;
    }

    const { data, error } = await supabase
      .from('Tenures')
      .insert([
        {
          user_id,
          house_id,
          tenure_start,
          tenure_end,
          active: active ?? true,
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
