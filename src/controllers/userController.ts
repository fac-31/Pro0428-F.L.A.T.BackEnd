import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

// Get user by ID
export async function getUserById(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.from('Users').select('*').eq('id', id).single();

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

// Create a new user
export async function createUser(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const { name, email, preferences } = req.body;

    const { data, error } = await supabase
      .from('Users')
      .insert([{ name, email, preferences }])
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
