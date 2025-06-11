import { z } from 'zod';

export const UpdateTaskStatusSchema = z.object({
  cleaning_task_id: z.string().uuid(),
  task_complete: z.boolean(),
});
