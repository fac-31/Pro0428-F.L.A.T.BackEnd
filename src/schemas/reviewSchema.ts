import { z } from 'zod';

export const ReviewSchema = z.object({
  weekly_vibes_id: z.string().uuid(),
  user_id: z.string().uuid(),
  house_id: z.string().uuid(),
  individual_survey_result: z.string(),
  date_of_survey: z.string().optional(),
});
