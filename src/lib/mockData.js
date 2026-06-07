// src/lib/mockData.js
//
// All the fake data used when running in demo mode (no Supabase credentials).
// Realistic enough to look good in screenshots and demos.

export const MOCK_MOSQUES = [
  {
    id: 'mosque-1',
    name: 'Masjid Al-Noor',
    city: 'Toronto',
    province: 'ON',
    country: 'Canada',
    address: '123 Noor Ave, Toronto, ON M1A 1A1',
    phone: '(416) 555-0101',
    email: 'info@masjidalnoor.ca',
    description: 'Serving the Muslim community of East Toronto since 1992. All are welcome.',
    latitude: 43.7,
    longitude: -79.4,
    slug: 'masjid-al-noor',
  },
  {
    id: 'mosque-2',
    name: 'Islamic Centre of Mississauga',
    city: 'Mississauga',
    province: 'ON',
    country: 'Canada',
    address: '456 Erin Mills Pkwy, Mississauga, ON L5M 2B1',
    phone: '(905) 555-0202',
    email: 'contact@icmississauga.ca',
    description: 'A hub for learning, worship, and community in the heart of Mississauga.',
    latitude: 43.55,
    longitude: -79.65,
    slug: 'islamic-centre-mississauga',
  },
  {
    id: 'mosque-3',
    name: 'Dar Al-Islam',
    city: 'Brampton',
    province: 'ON',
    country: 'Canada',
    address: '789 Bramalea Rd, Brampton, ON L6T 3P4',
    phone: '(905) 555-0303',
    email: 'admin@daralislam.ca',
    description: 'Dedicated to education, outreach, and spiritual growth.',
    latitude: 43.72,
    longitude: -79.76,
    slug: 'dar-al-islam',
  },
]

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    mosque_id: 'mosque-1',
    title: 'Eid Al-Adha Celebration',
    message: 'Join us for a community Eid gathering following Salah. Families welcome. Bring a dish to share!',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-2',
    mosque_id: 'mosque-1',
    title: 'Weekly Halaqa — Every Sunday 7PM',
    message: 'Brother Ahmed will be continuing the Tafsir of Surah Al-Baqarah. All brothers and sisters welcome.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-3',
    mosque_id: 'mosque-1',
    title: 'Parking Reminder',
    message: 'Please avoid parking on Noor Ave during Jumu\'ah. Use the rear lot off Crescent Blvd.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_EVENTS = [
  {
    id: 'evt-1',
    mosque_id: 'mosque-1',
    title: 'Youth Basketball Night',
    description: 'Monthly basketball for brothers ages 16-30. Bring water and wear gym shoes.',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Noor Community Centre Gym',
  },
  {
    id: 'evt-2',
    mosque_id: 'mosque-1',
    title: 'Sisters Iftar Gathering',
    description: 'Annual sisters-only iftar dinner. RSVP by the 10th.',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Masjid Al-Noor Hall',
  },
]

export const MOCK_MEMBERS = [
  { id: 'm-1', mosque_id: 'mosque-1', full_name: 'Ahmed Hassan', email: 'ahmed@email.com', role: 'admin', joined_at: '2023-01-15' },
  { id: 'm-2', mosque_id: 'mosque-1', full_name: 'Fatima Khan',  email: 'fatima@email.com', role: 'member', joined_at: '2023-03-20' },
  { id: 'm-3', mosque_id: 'mosque-1', full_name: 'Omar Siddiqui', email: 'omar@email.com', role: 'member', joined_at: '2023-06-10' },
  { id: 'm-4', mosque_id: 'mosque-1', full_name: 'Aisha Rahman', email: 'aisha@email.com', role: 'member', joined_at: '2024-01-05' },
  { id: 'm-5', mosque_id: 'mosque-1', full_name: 'Yusuf Ali',    email: 'yusuf@email.com', role: 'member', joined_at: '2024-02-18' },
]

export const MOCK_DONATIONS = [
  { id: 'd-1', mosque_id: 'mosque-1', donor_name: 'Ahmed Hassan', amount: 500,  purpose: 'General Fund', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'd-2', mosque_id: 'mosque-1', donor_name: 'Anonymous',    amount: 200,  purpose: 'Building Fund', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'd-3', mosque_id: 'mosque-1', donor_name: 'Fatima Khan',  amount: 1000, purpose: 'Ramadan Fund',  created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'd-4', mosque_id: 'mosque-1', donor_name: 'Omar Siddiqui',amount: 150,  purpose: 'General Fund', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
]

// Hardcoded prayer times for demo (real app fetches from Aladhan API)
export const MOCK_PRAYER_TIMES = {
  Fajr:    '05:32',
  Sunrise: '07:01',
  Dhuhr:   '13:12',
  Asr:     '16:45',
  Maghrib: '20:18',
  Isha:    '21:48',
}
