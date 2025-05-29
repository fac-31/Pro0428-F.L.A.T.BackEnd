import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.ts';

interface BillData {
  house_id: string;
  bill_type: string;
  bill_amount: string;
  due_date: string;
  created_by_user: string;
  paid?: boolean;
  billing_period_start: string;
  billing_period_end: string;
}

export async function createBill(req: Request, res: Response, next?: NextFunction): Promise<void> {
  try {
    const {
      house_id,
      bill_type,
      bill_amount,
      due_date,
      created_by_user,
      paid,
      billing_period_start,
      billing_period_end,
    }: BillData = req.body;

    if (
      !house_id ||
      !bill_type ||
      !bill_amount ||
      !due_date ||
      !created_by_user ||
      !billing_period_start ||
      !billing_period_end
    ) {
      res.status(400).json({
        success: false,
        message:
          'Missing required fields: house_id, bill_type, bill_amount, due_date, created_by_user, billing_period_start, billing_period_end',
      });
      return;
    }

    const isPaid = paid !== undefined ? paid : false;

    const { data, error } = await supabase
      .from('Bills')
      .insert([
        {
          house_id,
          bill_type,
          bill_amount,
          due_date,
          created_by_user,
          paid: isPaid,
          billing_period_start,
          billing_period_end,
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
