import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';
import { v4 as uuidv4 } from 'uuid';
import { ReviewSchema } from '../schemas/reviewSchema.ts';

interface ContentednessData {
  user_id: string;
  house_id: string;
  individual_survey_result: string;
}

export async function createContentedness(
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

    const { house_id, individual_survey_result }: ContentednessData = req.body;

    if (!house_id || individual_survey_result === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: house_id, individual_survey_result',
      });
      return;
    }

    const weekly_vibes_id = uuidv4();

    const { data, error } = await supabase
      .from('Week_summary_individual_response')
      .insert([
        {
          weekly_vibes_id,
          user_id,
          house_id,
          individual_survey_result,
          date_of_survey: new Date().toISOString(),
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

export async function fetchContentedness(
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const house_id = req.user.house_id;

    if (!house_id) {
      res.status(400).json({ success: false, message: 'Missing house_id' });
      return;
    }

    const { data, error } = await supabase
      .from('Week_summary_individual_response')
      .select('*')
      .order('date_of_survey', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    const result = ReviewSchema.array().safeParse(data);

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
