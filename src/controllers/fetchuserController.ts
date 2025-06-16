import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';
import { UserSchema } from '../schemas/usersSchema.ts';

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

export async function fetchUserByName(houseId: string, name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('Users')
    .select('user_id')
    .eq('house_id', houseId)
    .eq('name', name)
    .single();

  if (error || !data) {
    console.error('Error retrieving user_id:', error?.message);
    return null;
  }

  console.log(data.user_id);
  return data.user_id;
}
