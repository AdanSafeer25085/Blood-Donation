// Donation history, computed stats, eligibility, and scheduling.
// Stats/eligibility are derived from the `donations` table rather than
// stored, so they stay correct automatically.
import { supabase } from '../lib/supabaseClient';

const DAYS_BETWEEN_DONATIONS = 56; // standard whole-blood interval

function mapDonation(d) {
  return {
    id: d.id,
    date: d.donation_date,
    time: d.donation_time,
    status: d.status,
    hospital: d.hospital,
    volume: d.volume,
    points: d.points,
    livesSaved: d.lives_saved,
    notes: d.notes,
    certificate: d.certificate,
  };
}

export async function getDonationHistory(userId) {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('donor_id', userId)
    .order('donation_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDonation);
}

// Compute dashboard stats from the donation history.
export async function getUserStats(userId) {
  const history = await getDonationHistory(userId);
  const completed = history.filter((d) => d.status === 'completed');
  const total = completed.length;

  // Next eligible date = last completed donation + 56 days.
  let nextEligibleDate = null;
  if (total > 0) {
    const last = completed
      .map((d) => new Date(d.date))
      .sort((a, b) => b - a)[0];
    const next = new Date(last);
    next.setDate(next.getDate() + DAYS_BETWEEN_DONATIONS);
    if (next > new Date()) nextEligibleDate = next.toLocaleDateString();
  }

  const achievements = [];
  if (total >= 1) achievements.push('First Drop');
  if (total >= 5) achievements.push('Life Saver');
  if (total >= 10) achievements.push('Hero Status');

  return {
    totalDonations: total,
    livesImpacted: total * 3,
    nextEligibleDate,
    currentStreak: total,
    totalPoints: total * 100,
    achievements,
  };
}

export async function checkEligibility(userId) {
  const history = await getDonationHistory(userId);
  const completed = history
    .filter((d) => d.status === 'completed')
    .map((d) => new Date(d.date))
    .sort((a, b) => b - a);

  if (completed.length === 0) {
    return {
      eligible: true,
      message: 'You are eligible to donate blood. Welcome!',
      nextEligibleDate: null,
    };
  }

  const next = new Date(completed[0]);
  next.setDate(next.getDate() + DAYS_BETWEEN_DONATIONS);
  const eligible = next <= new Date();
  return {
    eligible,
    message: eligible
      ? 'You are eligible to donate blood.'
      : `You can donate again on ${next.toLocaleDateString()}.`,
    nextEligibleDate: eligible ? null : next.toLocaleDateString(),
  };
}

// Book an appointment (a donation row with status 'scheduled').
export async function scheduleDonation({ donorId, date, time, centerId, hospital }) {
  const { data, error } = await supabase
    .from('donations')
    .insert({
      donor_id: donorId,
      center_id: centerId || null,
      hospital: hospital || null,
      donation_date: date,
      donation_time: time,
      status: 'scheduled',
    })
    .select()
    .single();
  if (error) throw error;
  return mapDonation(data);
}
