import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';
import { v4 as uuidv4 } from 'uuid';

interface ContentednessData {
  user_id: string;
  house_id: string;
  individual_survey_result: string;
}

export async function createContentedness(
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
): Promise<void> {
  try {
    const user_id = req.user?.id;

    const { house_id, individual_survey_result }: ContentednessData = req.body;

    if (!user_id || !house_id || individual_survey_result === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, house_id, individual_survey_result',
      });
      return;
    }

    const weekly_vibes_id = uuidv4();

    const { data, error } = await supabase
      .from('Weekly_summary_individual_response')
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
