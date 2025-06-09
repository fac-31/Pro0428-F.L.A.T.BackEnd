import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';
import { v4 as uuidv4 } from 'uuid';

interface HouseData {
  address: string;
  landlord_contact: object;
  house_preferences: object;
}

// Create a new house
export async function createHouse(
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { address, landlord_contact, house_preferences }: HouseData = req.body;
    const user_id = req.user.id;

    if (!address || !landlord_contact || !house_preferences) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: address, landlord_contact, house_preferences',
      });
      return;
    }

    const house_id = uuidv4();

    const { data: houseData, error: houseError } = await supabase
      .from('Houses')
      .insert([
        {
          house_id,
          address,
          landlord_contact,
          house_preferences,
          created_at: new Date().toISOString()
        },
      ])
      .select()
      .single();

    if (houseError) {
      console.error('❌ House creation error:', houseError);
      res.status(500).json({ success: false, error: houseError.message });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('Users')
      .update({ house_id })
      .eq('user_id', user_id)
      .select()
      .single();

    if (userError) {
      console.error('❌ User update error:', userError);
      await supabase.from('Houses').delete().eq('house_id', house_id);
      res.status(500).json({ success: false, error: userError.message });
      return;
    }

    res.status(201).json({ 
      success: true, 
      data: {
        house: houseData,
        user: userData
      }
    });
  } catch (err) {
    console.error('Create house error:', err);
    next?.(err);
  }
}
