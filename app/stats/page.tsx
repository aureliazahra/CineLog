"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

type Movie = {
  id: string
  title: string
  genre: string
  rating: number
  mood: string
}

const COLORS = ["#FACC15", "#F97316", "#EC4899", "#8B5CF6", "#06B6D4", "#10B981", "#EF4444", "#84CC16"]

export default function StatsPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login")
    })
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    const { data, error } = await supabase.from("movies").select("id, title, genre, rating, mood")
    if (!error && data) setMovies(data)
    setLoading(false)
  }

  // Genre data
  const genreData = Object.entries(
    movies.reduce((acc, m) => {
      if (m.genre) acc[m.genre] = (acc[m.genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  // Mood data
  const moodData = Object.entries(
    movies.reduce((acc, m) => {
      if (m.mood) acc[m.mood] = (acc[m.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  // Rating distribution
  const ratingData = Array.from({ length: 10 }, (_, i) => ({
    rating: `${i + 1}`,
    jumlah: movies.filter((m) => m.rating === i + 1).length
  }))

  // Average rating
  const avgRating = movies.length
    ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1)
    : "0"

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
      Loading...
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-yellow-400">📊 Stats</h2>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-white px-4 py-1.5 rounded-lg transition-colors"
            >
              ← Kembali
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Film", value: movies.length },
              { label: "Rata-rata Rating", value: `⭐ ${avgRating}` },
              { label: "Genre", value: genreData.length },
              { label: "Mood", value: moodData.length },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-900 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-yellow-400">{stat.value}</p>
                <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {movies.length === 0 ? (
            <div className="text-center text-zinc-500 py-20">
              <p className="text-5xl mb-4">🎞️</p>
              <p>Belum ada data. Tambah film dulu!</p>
            </div>
          ) : (
            <>
              {/* Rating Distribution */}
              <div className="bg-zinc-900 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Distribusi Rating</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ratingData}>
                    <XAxis dataKey="rating" stroke="#71717a" tick={{ fill: "#a1a1aa" }} />
                    <YAxis stroke="#71717a" tick={{ fill: "#a1a1aa" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                      labelStyle={{ color: "#facc15" }}
                    />
                    <Bar dataKey="jumlah" fill="#FACC15" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Genre & Mood Charts */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Genre Pie */}
                <div className="bg-zinc-900 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Genre Favorit</h3>
                  {genreData.length === 0 ? (
                    <p className="text-zinc-500 text-sm">Belum ada data genre</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                          {genreData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                        />
                        <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Mood Bar */}
                <div className="bg-zinc-900 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Mood Nonton</h3>
                  {moodData.length === 0 ? (
                    <p className="text-zinc-500 text-sm">Belum ada data mood</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={moodData} layout="vertical">
                        <XAxis type="number" stroke="#71717a" tick={{ fill: "#a1a1aa" }} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" stroke="#71717a" tick={{ fill: "#a1a1aa" }} width={70} />
                        <Tooltip
                          contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {moodData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}