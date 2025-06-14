import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Create a new user
export async function createUser(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const { name, email, password, preferences } = req.body;

    // 1. First create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      res.status(500).json({ success: false, error: authError.message });
      return;
    }

    if (!authData.user) {
      res.status(500).json({ success: false, error: 'User creation failed' });
      return;
    }

    // 2. Check if user already exists in database
    const { data: existingUser } = await supabase
      .from('Users')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .single();

    if (existingUser) {
      // User already exists, generate token and return success
      const token = jwt.sign(
        {
          sub: existingUser.user_id,
          house_id: null, // New users don't have a house yet
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        data: existingUser,
        token,
        message: 'User already exists',
      });
      return;
    }

    // 3. Create new user record if it doesn't exist
    const { data, error } = await supabase
      .from('Users')
      .insert([
        {
          user_id: authData.user.id,
          name,
          email,
          preferences,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      // If database insert fails, we should probably delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    // 4. Generate JWT token for the new user
    const token = jwt.sign(
      {
        sub: authData.user.id,
        house_id: null, // New users don't have a house yet
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // 5. Return success with token and user data
    res.status(201).json({ 
      success: true, 
      data,
      token,
      user: {
        id: authData.user.id,
        house_id: null
      }
    });
  } catch (err) {
    console.error('Create user error:', err);
    next?.(err);
  }
}

// Update user data
export async function updateUser(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { name, email, preferences } = req.body;

    if (!id) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    interface UpdateUserData {
      name?: string;
      email?: string;
      preferences?: string;
    }

    const updates: UpdateUserData = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (preferences !== undefined) updates.preferences = preferences;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, message: 'No fields provided to update' });
      return;
    }

    const { data, error } = await supabase
      .from('Users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

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

// Delete a user
export async function deleteUser(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const { data, error } = await supabase.from('Users').delete().eq('id', id).select().single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    next?.(err);
  }
}
