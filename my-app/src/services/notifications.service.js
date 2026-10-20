// Per-user notifications.
import { supabase } from '../lib/supabaseClient';

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    action: n.action,
    read: n.read,
    time: new Date(n.created_at).toLocaleString(),
  }));
}

export async function markAsRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function deleteNotification(id) {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  if (error) throw error;
  return true;
}
