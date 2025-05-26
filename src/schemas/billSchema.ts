import { z } from 'zod';

export const BillsSchema = z.object({
  bill_id: z.string().uuid(),
  house_id: z.string().uuid(),
  bill_type: z.string(),
  bill_amount: z.string(),
  due_date: z.string().optional(),
  created_by_user: z.string().uuid(),
  paid: z.boolean().optional(),
  billing_period_start: z.string().optional(),
  billing_period_end: z.string().optional(),
  created_at: z.string().optional(),
  active: z.boolean(),
});

