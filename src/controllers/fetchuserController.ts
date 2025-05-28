import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import { UserSchema } from '../schemas/usersSchema';

export async function fetchUserProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      res.status(400).json({ success: false, message: 'User ID missing from request' });
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) {
      res.status(500).json({ success: false, message: error.message });
      return;
    }

    const validation = UserSchema.safeParse(user);

    if (!validation.success) {
      console.error('❌ User data validation failed:', validation.error);
      res.status(500).json({ success: false, message: 'User data validation failed' });
      return;
    }

    res.status(200).json({ success: true, data: validation.data });
  } catch (err) {
    next(err);
  }
}
