import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';
import { BillsSchema } from '../schemas/billSchema';

export async function fetchBills(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const house_id = req.query.house_id as string | undefined;

    if (!house_id) {
      res.status(400).json({ success: false, message: 'Missing house_id' });
      return;
    }

    const { data, error } = await supabase
      .from('Bills')
      .select('*')
      .eq('house_id', house_id);

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    const result = BillsSchema.safeParse(data);

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
