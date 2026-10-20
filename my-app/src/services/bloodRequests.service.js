// Blood requests + donor contacts + responses.
import { supabase } from '../lib/supabaseClient';

// DB row -> shape used by the dashboard "available requests" feed.
function mapForFeed(r) {
  return {
    id: r.id,
    patientName: r.patient_name,
    bloodType: r.blood_group,
    priority: r.urgency,
    location: r.location,
    hospital: r.hospital,
    unitsNeeded: r.units_needed,
    contactNumber: r.contact_number,
    createdAt: r.created_at,
    message: r.description,
    deadline: r.needed_by,
  };
}

// DB row -> shape used by "my requests" and the public requests page.
function mapFull(r) {
  return {
    id: r.id,
    patientName: r.patient_name,
    bloodGroup: r.blood_group,
    unitsNeeded: r.units_needed,
    urgency: r.urgency,
    hospital: r.hospital,
    location: r.location,
    contactNumber: r.contact_number,
    neededBy: r.needed_by,
    description: r.description,
    requesterName: r.requester_name,
    relationToPatient: r.relation_to_patient,
    status: r.status,
    createdAt: r.created_at,
  };
}

// Active requests for the dashboard feed.
export async function getActiveRequests() {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapForFeed);
}

// Active requests for the public page (full shape).
export async function getPublicRequests() {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapFull);
}

// A user's own requests.
export async function getMyRequests(userId) {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('requester_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapFull);
}

// Create a request. Accepts the camelCase form object.
export async function createRequest(form, requesterId) {
  const row = {
    requester_id: requesterId || null,
    patient_name: form.patientName || 'Anonymous Patient',
    cnic: form.cnic || null,
    blood_group: form.bloodGroup || form.bloodType,
    units_needed: form.unitsNeeded || 1,
    urgency: form.urgency || form.priority || 'normal',
    hospital: form.hospital,
    location: form.location,
    contact_number: form.contactNumber,
    needed_by: form.neededBy || form.deadline || null,
    description: form.description || form.message || null,
    requester_name: form.requesterName || 'Anonymous',
    relation_to_patient: form.relationToPatient || 'Self',
    status: 'active',
  };
  const { data, error } = await supabase
    .from('blood_requests')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return mapFull(data);
}

export async function updateRequestStatus(id, status) {
  const { data, error } = await supabase
    .from('blood_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRequest(id) {
  const { error } = await supabase.from('blood_requests').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function respondToRequest({ requestId, donorId, responseType, message }) {
  const { data, error } = await supabase
    .from('request_responses')
    .insert({
      request_id: requestId,
      donor_id: donorId,
      response_type: responseType,
      message: message || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function contactDonor({ requestId, donorId, donorName }) {
  const { data, error } = await supabase
    .from('donor_contacts')
    .insert({
      request_id: requestId,
      donor_id: donorId,
      donor_name: donorName,
      status: 'sent',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
