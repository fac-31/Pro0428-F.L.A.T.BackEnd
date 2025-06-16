import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';
import { AuthenticatedRequest } from '../types/authenticatedRequest.ts';
import { v4 as uuidv4 } from 'uuid';

interface BillData {
  house_id: string;
  bill_type: string;
  bill_amount: string;
  due_date: string;
}

export async function createBill(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const created_by_user = req.user?.id;

    if (!created_by_user) {
      res.status(400).json({ success: false, message: 'Missing user_id from token' });
      return;
    }

    const { house_id, bill_type, bill_amount, due_date }: BillData = req.body;

    if (!house_id || !bill_type || !bill_amount || !due_date) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: house_id, bill_type, bill_amount, due_date',
      });
      return;
    }

    const bill_id = uuidv4();
    const isPaid = false;

    const { data, error } = await supabase
      .from('Bills')
      .insert([
        {
          bill_id,
          house_id,
          bill_type,
          bill_amount,
          due_date,
          created_by_user,
          paid: isPaid,
          billing_period_start: new Date().toISOString(),
          billing_period_end: new Date().toISOString(),
          created_at: new Date().toISOString(),
          active: true,
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
