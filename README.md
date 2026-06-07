# MasjidOS 🕌

Muslim communities deserve better tools.

Most mosques today manage their communities through scattered WhatsApp groups, paper sign-up sheets, and spreadsheets passed between volunteers. Announcements get missed. Donation records are inconsistent. New members don't know where to look. MasjidOS is built to fix that — a single platform where mosque administrators can run their community, and where any member of the public can find their local masjid.

---

## What it does

**For the community**

Anyone can open MasjidOS, find their mosque, and see everything they need — today's prayer times pulled live from their location, upcoming events, announcements from the imam, and how to donate. No account needed. No app to download.

**For mosque administrators**

A clean admin portal that replaces the spreadsheets and group chats. Track donations and who gave them. Manage your member list. Post announcements that show up instantly on your public page. Schedule events. Update your mosque's information. All in one place, from any device.

---

## The problem it solves

A volunteer treasurer shouldn't be managing donation records in a personal Excel file that lives on one laptop. An imam shouldn't have to send the same Jumu'ah reminder to five different WhatsApp groups. A new Muslim in a city shouldn't have to Google "mosque near me" and get a six-year-old Facebook page.

MasjidOS gives every mosque — regardless of size or budget — the kind of digital infrastructure that larger organizations take for granted.

---

## Try it

The app runs in demo mode out of the box. No account, no setup, no credentials required.

```bash
git clone https://github.com/KhizrSidz/MasjidOS.git
cd MasjidOS
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the mosque directory. Click **Admin Login** to explore the full admin portal with sample data.

---

## Connecting a real database

MasjidOS uses [Supabase](https://supabase.com) as its backend — free to start, scales with your community.

1. Create a free Supabase project
2. Copy `.env.example` to `.env` and fill in your project URL and anon key
3. Restart the dev server

The app automatically switches from demo data to your live database. No code changes needed.

---

## Roadmap

- [ ] Zakat calculator integrated into the donation flow  
- [ ] SMS/email notifications for announcements  
- [ ] Jumu'ah khutbah archive  
- [ ] Volunteer coordination and sign-ups  
- [ ] Multilingual support (Arabic, Urdu, French)  
- [ ] Mobile app

---

## Tech

React · Vite · Supabase · Aladhan Prayer Times API

---

*Built for the Muslim community. Contributions welcome.*
