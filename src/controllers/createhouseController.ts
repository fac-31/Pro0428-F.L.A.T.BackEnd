import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

interface HouseData {
  address: string;
  landlord_contact: object;
  house_preferences: object;
}

// Create a new house
export async function createHouse(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const { address, landlord_contact, house_preferences }: HouseData = req.body;

    if (!address || !landlord_contact || !house_preferences) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: address, landlord_contact, house_preferences',
      });
      return;
    }

    const { data, error } = await supabase
      .from('Houses')
      .insert([
        {
          address,
          landlord_contact,
          house_preferences,
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
