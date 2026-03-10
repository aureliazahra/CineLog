# 🎬 CineLog

A personal movie watchlist app built with **Next.js**, **Supabase**, and **Tailwind CSS**. Track every film you've watched, rate them, tag your mood, and visualize your watch history with stats.

---

## ✨ Features

- 🔐 **Authentication** — Login with Email or Google (via Supabase Auth)
- 🎥 **Movie Watchlist** — Add, edit, and delete movies from your personal list
- 🖼️ **Poster Upload** — Drag & drop or click to upload movie posters (stored in Supabase Storage)
- ⭐ **Rating & Review** — Rate films 1–10 and write personal reviews
- 🎭 **Mood Tags** — Tag how you felt watching: hype, sedih, santai, bored, romantic
- 🔍 **Search & Filter** — Filter by title, genre, or mood
- 📊 **Stats Page** — Visualize your watch history with genre, mood, and rating charts
- 🔒 **Per-user Data** — Each user only sees their own watchlist (Row Level Security)

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| [Next.js 14](https://nextjs.org/) | Frontend framework (App Router) |
| [Supabase](https://supabase.com/) | Database, Auth, Storage |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Recharts](https://recharts.org/) | Stats charts |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/username/cine-log.git
cd cine-log
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Create a `movies` table with the following columns:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, default: `gen_random_uuid()` |
| created_at | timestamptz | Default: `now()` |
| title | text | Not null |
| poster_url | text | |
| genre | text | |
| rating | int2 | |
| review | text | |
| mood | text | |
| watch_date | date | |
| user_id | uuid | Foreign key to auth.users |

3. Create a public storage bucket named `posters`

4. Run the following SQL in the Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "select own movies" ON movies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own movies" ON movies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own movies" ON movies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete own movies" ON movies FOR DELETE USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "upload posters" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posters' AND auth.uid() IS NOT NULL);
CREATE POLICY "view posters" ON storage.objects FOR SELECT USING (bucket_id = 'posters');
CREATE POLICY "delete posters" ON storage.objects FOR DELETE USING (bucket_id = 'posters' AND auth.uid() IS NOT NULL);
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
cine-log/
├── app/
│   ├── page.tsx          # Home / watchlist page
│   ├── login/page.tsx    # Login & register page
│   ├── stats/page.tsx    # Stats & charts page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── MovieCard.tsx       # Movie card component
│   ├── AddMovieModal.tsx   # Add movie form modal
│   ├── EditMovieModal.tsx  # Edit movie form modal
│   └── Navbar.tsx          # Navigation bar
├── lib/
│   └── supabase.js         # Supabase client
└── .env.local              # Environment variables (not committed)
```

---

## 🌐 Deploy

This app can be deployed for free on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo on Vercel
3. Add your environment variables in Vercel project settings
4. Update the Google OAuth redirect URL to your Vercel domain
