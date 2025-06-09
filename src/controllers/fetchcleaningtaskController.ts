import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { CleaningTaskSchema } from '../schemas/cleaningtaskSchema.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';

export async function fetchCleaningTasks(
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const house_id = req.user.house_id;

    if (!house_id) {
      res.status(400).json({ success: false, message: 'Cleaning Task: Missing house_id' });
      return;
    }

    const { data, error } = await supabase
      .from('Cleaning_task')
      .select('*')
      .eq('house_id', house_id);

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    const result = CleaningTaskSchema.array().safeParse(data);

    if (!result.success) {
      console.error('❌ Data validation error:', result.error.format());
      res.status(500).json({ success: false, error: 'Data validation failed' });
      return;
    }

    res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
}
