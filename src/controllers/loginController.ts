import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.ts';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    // 1. Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const userId = authData.user.id;

    // 2. Fetch user profile from your public `users` table
    const { data: userProfile, error: profileError } = await supabase
      .from('Users')
      .select('user_id, house_id')
      .eq('user_id', userId)
      .single();

    if (profileError || !userProfile) {
      res.status(404).json({ success: false, message: 'User profile not found' });
      return;
    }

    // 3. Sign JWT with user_id and house_id
    const token = jwt.sign(
      {
        sub: userProfile.user_id,
        house_id: userProfile.house_id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // 4. Return token and user info
    res.status(200).json({
      success: true,
      token,
      user: {
        id: userProfile.user_id,
        house_id: userProfile.house_id,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};
