import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';

interface WelcomePreferencesData {
  user_id: string;
  house_id: string;
  user_preferences: Record<string, string | number | boolean>;
  house_preferences: Record<string, string | number | boolean>;
}

export async function saveWelcomePreferences(
  req: AuthenticatedRequest & { body: WelcomePreferencesData },
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { user_preferences, house_preferences } = req.body;
    const user_id = req.user.id;
    const house_id = req.user.house_id;

    console.log('🚀 [welcomePreferencesController] Saving preferences:', {
      userId: user_id,
      houseId: house_id,
      hasUserPreferences: !!user_preferences,
      hasHousePreferences: !!house_preferences
    });

    if (!user_id || !house_id) {
      console.error('❌ [welcomePreferencesController] Missing required IDs:', { user_id, house_id });
      res.status(400).json({
        success: false,
        message: 'User ID and House ID are required',
      });
      return;
    }

    console.log('📝 [welcomePreferencesController] Updating user preferences in Supabase...');
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .update({ preferences: user_preferences })
      .eq('user_id', user_id)
      .select()
      .single();

    if (userError) {
      console.error('❌ [welcomePreferencesController] Error updating user preferences:', {
        error: userError,
        userId: user_id,
        preferences: user_preferences
      });
      res.status(500).json({ success: false, error: userError.message });
      return;
    }

    console.log('✅ [welcomePreferencesController] User preferences updated:', userData);

    console.log('📝 [welcomePreferencesController] Updating house preferences in Supabase...');
    const { data: houseData, error: houseError } = await supabase
      .from('Houses')
      .update({ house_preferences })
      .eq('house_id', house_id)
      .select()
      .single();

    if (houseError) {
      console.error('❌ [welcomePreferencesController] Error updating house preferences:', {
        error: houseError,
        houseId: house_id,
        preferences: house_preferences
      });
      res.status(500).json({ success: false, error: houseError.message });
      return;
    }

    console.log('✅ [welcomePreferencesController] House preferences updated:', houseData);

    res.status(200).json({
      success: true,
      data: {
        user: userData,
        house: houseData,
      },
    });
  } catch (err) {
    console.error('❌ [welcomePreferencesController] Unexpected error:', err);
    next?.(err);
  }
}
