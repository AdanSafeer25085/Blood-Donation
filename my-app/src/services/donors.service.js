// Donor directory: list / search / nearby.
// Reads from the public `profiles` table.
import { supabase } from '../lib/supabaseClient';
import { mapProfile } from './auth.service';

// All donors (used by Find Donors page).
export async function getDonors() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((p) => mapProfile(p));
}

// Search by blood group and/or location.
export async function searchDonors({ bloodGroup, location } = {}) {
  let query = supabase.from('profiles').select('*');
  if (bloodGroup) query = query.eq('blood_group', bloodGroup);
  if (location) query = query.ilike('location', `%${location}%`);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((p) => mapProfile(p));
}

// Nearby donors for the dashboard. Shapes the result to the fields the
// NearbyDonors component renders.
export async function getNearbyDonors({ location, bloodType, excludeId } = {}) {
  let query = supabase.from('profiles').select('*');
  if (bloodType) query = query.eq('blood_group', bloodType);
  if (location) query = query.ilike('location', `%${location}%`);
  const { data, error } = await query;
  if (error) throw error;

  return (data || [])
    .filter((p) => p.id !== excludeId)
    .map((p) => ({
      id: p.id,
      firstName: p.first_name,
      lastName: p.last_name,
      bloodGroup: p.blood_group,
      location: p.location,
      distance: '',
      totalDonations: 0,
      rating: 5.0,
      reviews: 0,
      available: p.available,
      verified: p.verified,
      lastActive: 'recently',
      bio: p.bio || '',
      specialties: [],
    }));
}
