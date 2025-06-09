import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';
import { HouseSchema } from '../schemas/houseinfoSchema.ts';

export async function fetchHouseInfo(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const house_id = req.user.house_id;

    if (!house_id) {
      res.status(400).json({ success: false, message: 'User has no house_id assigned' });
      return;
    }

    const { data: houseInfo, error } = await supabase
      .from('Houses')
      .select('*')
      .eq('house_id', house_id)
      .single();

    if (error) {
      res.status(500).json({ success: false, message: error.message });
      return;
    }

    const validation = HouseSchema.safeParse(houseInfo);

    if (!validation.success) {
      console.error('❌ House data validation failed:', validation.error.format());
      res.status(500).json({ success: false, message: 'House data validation failed' });
      return;
    }

    res.status(200).json({ success: true, data: validation.data });
  } catch (err) {
    next(err);
  }
}

export async function fetchAllHouses(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { data: houses, error } = await supabase.from('Houses').select('*');

    if (error) {
      console.error('Fetch houses error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    const validation = HouseSchema.array().safeParse(houses);

    if (!validation.success) {
      console.error('House data validation failed:', validation.error.format());
      res.status(500).json({ success: false, message: 'House data validation failed' });
      return;
    }

    res.status(200).json({ success: true, data: validation.data });
  } catch (err) {
    next(err);
  }
}
