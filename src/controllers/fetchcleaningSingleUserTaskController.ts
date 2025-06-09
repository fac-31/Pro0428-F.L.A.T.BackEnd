import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { CleaningTaskSchema } from '../schemas/cleaningtaskSchema.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';

export async function fetchSingleUserCleaningTasks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(400).json({ success: false, message: 'Missing user_id from token' });
      return;
    }

    const { data, error } = await supabase
      .from('Cleaning_task')
      .select('*')
      .eq('assigned_to_user', user_id);

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    const result = CleaningTaskSchema.array().safeParse(data);

    if (!result.success) {
      console.error('❌ Data validation error:', result.error.format());
      res.status(422).json({ success: false, error: 'Data validation failed' });
      return;
    }

    res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    next(err);
  }
}
