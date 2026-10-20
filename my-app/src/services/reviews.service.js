// Reviews on donor profiles.
import { supabase } from '../lib/supabaseClient';

export async function getReviews(donorId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('donor_id', donorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitReview({ donorId, review, authorId }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({ donor_id: donorId, review, author_id: authorId || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}
