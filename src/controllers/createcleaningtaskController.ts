import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { v4 as uuidv4 } from 'uuid';
import { fetchUserByName } from './fetchuserController.ts';

interface CleaningTaskData {
  assigned_to_user: string;
  house_id: string;
  description: string;
  due_date: string;
}

export async function createCleaningTask(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { assigned_to_user, house_id, description, due_date }: CleaningTaskData = req.body;

    if (!assigned_to_user || !house_id || !description || !due_date) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: assigned_to_user, house_id, description, due_date',
      });
      return;
    }

    const assigned_to_user_id = await fetchUserByName(house_id, assigned_to_user);

    if (!assigned_to_user_id) {
      res.status(400).json({ success: false, error: 'User not found' });
      return;
    }

    const cleaning_task_id = uuidv4();
    const isComplete = false;

    const { data, error } = await supabase
      .from('Cleaning_task')
      .insert([
        {
          cleaning_task_id,
          assigned_to_user: assigned_to_user_id,
          house_id,
          description,
          due_date: new Date(due_date).toISOString(),
          task_complete: isComplete,
          created_at: new Date().toISOString(),
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
