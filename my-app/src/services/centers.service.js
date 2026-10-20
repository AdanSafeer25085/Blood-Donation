// Donation centers + available time slots.
import { supabase } from '../lib/supabaseClient';

export async function getCenters() {
  const { data, error } = await supabase
    .from('donation_centers')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    location: c.location,
    address: c.address,
    rating: c.rating,
    reviews: c.reviews_count,
  }));
}

// Fixed daily slots; a slot is marked unavailable if another appointment
// already exists for that center + date + time.
const DEFAULT_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];

export async function getAvailableSlots({ date, centerId }) {
  let taken = [];
  if (date && centerId) {
    const { data } = await supabase
      .from('donations')
      .select('donation_time')
      .eq('center_id', centerId)
      .eq('donation_date', date)
      .eq('status', 'scheduled');
    taken = (data || []).map((d) => d.donation_time);
  }
  return DEFAULT_SLOTS.map((time) => ({
    time,
    available: !taken.includes(time),
  }));
}
