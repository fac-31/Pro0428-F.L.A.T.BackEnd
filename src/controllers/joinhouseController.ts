import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';

export async function joinHouse(
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { house_id } = req.body;
    const user_id = req.user.id;

    if (!house_id) {
      res.status(400).json({
        success: false,
        message: 'House ID is required',
      });
      return;
    }

    // Check if the house exists
    const { data: houseData, error: houseError } = await supabase
      .from('Houses')
      .select('house_id')
      .eq('house_id', house_id)
      .single();

    if (houseError || !houseData) {
      res.status(404).json({ success: false, message: 'House not found' });
      return;
    }

    // Update user's house_id
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .update({ house_id })
      .eq('user_id', user_id)
      .select()
      .single();

    if (userError) {
      console.error('❌ User update error:', userError);
      res.status(500).json({ success: false, error: userError.message });
      return;
    }

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (err) {
    console.error('Join house error:', err);
    next?.(err);
  }
}
