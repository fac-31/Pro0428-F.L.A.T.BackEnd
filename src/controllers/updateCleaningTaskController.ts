import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { UpdateTaskStatusSchema } from '../schemas/cleaningtaskupdateSchema.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';

export async function updateCleaningTaskStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = UpdateTaskStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.format() });
      return;
    }

    const { cleaning_task_id, task_complete } = parsed.data;

    const { data, error } = await supabase
      .from('Cleaning_task')
      .update({ task_complete })
      .eq('cleaning_task_id', cleaning_task_id)
      .select();

    if (error) {
      console.error('❌ Supabase update error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    next(err);
  }
}
