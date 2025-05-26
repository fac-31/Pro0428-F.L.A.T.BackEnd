import { z } from 'zod';

export const CleaningTaskSchema = z.object({
  cleaning_task_id: z.string().uuid(),
  assigned_to_user: z.string().uuid().optional(),
  house_id: z.string().uuid().optional(),
  description: z.string(),
  due_date: z.string().optional(),
  task_complete: z.boolean().optional(),
  created_at: z.string().optional(),
});
