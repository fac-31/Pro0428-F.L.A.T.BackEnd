import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

interface CleaningTaskData {
  assigned_to_user: string;
  house_id: string;
  description: string;
  due_date: string;
  task_complete: boolean;
}

export async function createCleaningTask(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const { assigned_to_user, house_id, description, due_date, task_complete }: CleaningTaskData =
      req.body;

    if (!assigned_to_user || !house_id || !description || !due_date) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: assigned_to_user, house_id, description, due_date',
      });
      return;
    }

    const isComplete = task_complete !== undefined ? task_complete : false;

    const { data, error } = await supabase
      .from('Cleaning_Tasks')
      .insert([
        {
          assigned_to_user,
          house_id,
          description,
          due_date,
          task_complete: isComplete,
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
