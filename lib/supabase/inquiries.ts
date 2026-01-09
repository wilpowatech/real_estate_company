// lib/supabase/inquiries.ts
import { createClient } from './client';

const supabase = createClient();

export const addInquiry = async (task: string) => {
  const { data, error } = await supabase.from('inquiries').insert([{ task }]);
  if (error) throw error;
  return data;
};

export const getUserInquiries = async () => {
  const { data, error } = await supabase.from('inquiries').select('*');
  if (error) throw error;
  return data;
};
