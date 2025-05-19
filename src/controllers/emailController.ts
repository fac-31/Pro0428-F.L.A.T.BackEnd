import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

interface EmailData {
  user_id: string;
  house_id: string;
  subject: string;
  body: string;
  notification_type: string;
  send_at: string;
}

// Create a new Email
export async function createEmail(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const { user_id, house_id, subject, body, notification_type, send_at }: EmailData = req.body;

    if (!user_id || !house_id || !subject || !body || !notification_type || !send_at) {
      res.status(400).json({
        success: false,
        message:
          'Missing required fields: user_id, house_id, subject, body, notification_type, send_at',
      });
      return;
    }

    const { data, error } = await supabase
      .from('Emails')
      .insert([
        {
          user_id,
          house_id,
          subject,
          body,
          notification_type,
          status: 'queued',
          send_at,
          sent_at: null,
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
