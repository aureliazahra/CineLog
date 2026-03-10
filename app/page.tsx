"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import MovieCard from "@/components/MovieCard"
import AddMovieModal from "@/components/AddMovieModal"
import EditMovieModal from "@/components/EditMovieModal"
import Navbar from "@/components/Navbar"

type Movie = {
  id: string
  title: string
  poster_url: string
  genre: string
  rating: number
  review: string
  mood: string
  watch_date: string
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filtered, setFiltered] = useState<Movie[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editMovie, setEditMovie] = useState<Movie | null>(null)
  const [search, setSearch] = useState("")
  const [filterGenre, setFilterGenre] = useState("")
  const [filterMood, setFilterMood] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login")
    })
  }, [])

  const fetchMovies = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setMovies(data)
      setFiltered(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus film ini?")) return
    await supabase.from("movies").delete().eq("id", id)
    fetchMovies()
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  useEffect(() => {
    let result = movies
    if (search) result = result.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    if (filterGenre) result = result.filter((m) => m.genre === filterGenre)
    if (filterMood) result = result.filter((m) => m.mood === filterMood)
    setFiltered(result)
  }, [search, filterGenre, filterMood, movies])

  const genres = [...new Set(movies.map((m) => m.genre).filter(Boolean))]
  const moods = [...new Set(movies.map((m) => m.mood).filter(Boolean))]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-zinc-400 text-sm">{movies.length} film dalam watchlist kamu</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-400 text-black font-bold px-5 py-2 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              + Tambah Film
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <input
              type="text"
              placeholder="🔍 Cari film..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400 flex-1 min-w-[200px]"
            />
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Semua Genre</option>
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Semua Mood</option>
              {moods.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center text-zinc-400 py-20">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-zinc-500 py-20">
              <p className="text-5xl mb-4">🎞️</p>
              <p>Belum ada film. Yuk tambah yang pertama!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} onEdit={(movie) => setEditMovie(movie)} />
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <AddMovieModal onClose={() => setShowModal(false)} onAdded={fetchMovies} />
        )}
        {editMovie && (
          <EditMovieModal
            movie={editMovie}
            onClose={() => setEditMovie(null)}
            onUpdated={fetchMovies}
          />
)}
      </main>
    </>
  )
}