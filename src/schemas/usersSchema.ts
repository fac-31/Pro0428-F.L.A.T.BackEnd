import { z } from 'zod';

export const UserSchema = z.object({
  user_id: z.string().uuid(),
  preferences: z.any().optional().nullable(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.string().optional().nullable(),
  house_id: z.string().uuid().optional().nullable(),
});
