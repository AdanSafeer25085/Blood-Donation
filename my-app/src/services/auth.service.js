// Authentication + profile service.
//
// Wraps Supabase Auth (auth.users) and the public.profiles table, and
// maps the snake_case DB row to the camelCase `user` object the rest of
// the app already expects (user.firstName, user.bloodGroup, ...).
import { supabase } from '../lib/supabaseClient';

// DB row (snake_case)  ->  app user object (camelCase)
export function mapProfile(profile, authUser) {
  if (!profile) return null;
  return {
    id: profile.id,
    email: profile.email || authUser?.email || '',
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    mobileNumber: profile.mobile_number || '',
    location: profile.location || '',
    bloodGroup: profile.blood_group || '',
    bio: profile.bio || '',
    emergencyContact: profile.emergency_contact || '',
    emergencyPhone: profile.emergency_phone || '',
    medicalConditions: profile.medical_conditions || '',
    medications: profile.medications || '',
    allergies: profile.allergies || '',
    available: profile.available,
    verified: profile.verified,
  };
}

// Fetch the profile row for a given auth user id.
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// Returns the currently signed-in app user (or null).
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  try {
    const profile = await fetchProfile(session.user.id);
    return mapProfile(profile, session.user);
  } catch {
    return null;
  }
}

// Register a new user. Profile row is created automatically by the
// `handle_new_user` trigger from the metadata passed here.
export async function register({
  firstName,
  lastName,
  mobileNumber,
  email,
  password,
  location,
  bloodGroup,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        location,
        blood_group: bloodGroup,
      },
    },
  });
  if (error) throw error;
  return data;
}

// Sign in with email + password.
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  const profile = await fetchProfile(data.user.id);
  return mapProfile(profile, data.user);
}

export async function logout() {
  await supabase.auth.signOut();
}

// Update the current user's profile. Accepts camelCase keys.
export async function updateProfile(userId, fields) {
  const patch = {};
  if (fields.firstName !== undefined) patch.first_name = fields.firstName;
  if (fields.lastName !== undefined) patch.last_name = fields.lastName;
  if (fields.mobileNumber !== undefined) patch.mobile_number = fields.mobileNumber;
  if (fields.location !== undefined) patch.location = fields.location;
  if (fields.bloodGroup !== undefined) patch.blood_group = fields.bloodGroup;
  if (fields.bio !== undefined) patch.bio = fields.bio;
  if (fields.emergencyContact !== undefined) patch.emergency_contact = fields.emergencyContact;
  if (fields.emergencyPhone !== undefined) patch.emergency_phone = fields.emergencyPhone;
  if (fields.medicalConditions !== undefined) patch.medical_conditions = fields.medicalConditions;
  if (fields.medications !== undefined) patch.medications = fields.medications;
  if (fields.allergies !== undefined) patch.allergies = fields.allergies;
  if (fields.available !== undefined) patch.available = fields.available;

  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return mapProfile(data);
}

// Subscribe to auth state changes. Returns an unsubscribe function.
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}
