import { z } from 'zod';

export const HouseSchema = z.object({
  house_id: z.string().uuid(),
  address: z.string(),
  landlord_contact: z.record(z.any()).nullable(),
  house_preferences: z.record(z.any()).nullable(),
  created_at: z.string().datetime().nullable(),
});
