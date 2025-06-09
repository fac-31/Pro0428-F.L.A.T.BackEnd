import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';

interface WelcomePreferencesData {
  user_id: string;
  house_id: string;
  user_preferences: Record<string, any>;
  house_preferences: Record<string, any>;
}

export async function saveWelcomePreferences(
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { user_preferences, house_preferences } = req.body;
    const user_id = req.user.id;
    const house_id = req.user.house_id;

    if (!user_id || !house_id) {
      res.status(400).json({
        success: false,
        message: 'User ID and House ID are required',
      });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('Users')
      .update({ preferences: user_preferences })
      .eq('user_id', user_id)
      .select()
      .single();

    if (userError) {
      console.error('Error updating user preferences:', userError);
      res.status(500).json({ success: false, error: userError.message });
      return;
    }

    const { data: houseData, error: houseError } = await supabase
      .from('Houses')
      .update({ house_preferences })
      .eq('house_id', house_id)
      .select()
      .single();

    if (houseError) {
      console.error('Error updating house preferences:', houseError);
      res.status(500).json({ success: false, error: houseError.message });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: userData,
        house: houseData,
      },
    });
  } catch (err) {
    next?.(err);
  }
}
