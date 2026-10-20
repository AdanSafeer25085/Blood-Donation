-- =====================================================================
-- 08_seed.sql  —  OPTIONAL demo data (run last, or skip entirely)
-- Depends on: 04_blood_requests.sql
--
-- Seeds a few public blood requests so the "Blood Requests" pages are
-- not empty on a fresh project. Only inserts if the table is empty.
-- Delete these rows any time; they are not required by the app.
-- =====================================================================

insert into public.blood_requests (
  patient_name, cnic, blood_group, units_needed, urgency,
  hospital, location, contact_number, needed_by,
  description, requester_name, relation_to_patient, status
)
select * from (values
  ('Ahmad Ali',   '1234567890123', 'O+',  2, 'urgent',
   'Aga Khan University Hospital', 'Karachi, Pakistan', '03001234567',
   timezone('utc', now()) + interval '2 days',
   'Emergency surgery required for accident patient',
   'Muhammad Hassan', 'Brother', 'active'),
  ('Fatima Khan', '9876543210987', 'B-',  1, 'critical',
   'Shaukat Khanum Hospital', 'Lahore, Pakistan', '03009876543',
   timezone('utc', now()) + interval '1 day',
   'Cancer patient needs immediate blood transfusion',
   'Ali Khan', 'Father', 'active'),
  ('Sara Ahmed',  '1122334455667', 'AB+', 3, 'normal',
   'Services Hospital', 'Lahore, Pakistan', '03001122334',
   timezone('utc', now()) + interval '5 days',
   'Planned surgery for heart operation',
   'Ahmed Ali', 'Husband', 'active')
) as seed(patient_name, cnic, blood_group, units_needed, urgency,
          hospital, location, contact_number, needed_by,
          description, requester_name, relation_to_patient, status)
where not exists (select 1 from public.blood_requests);
