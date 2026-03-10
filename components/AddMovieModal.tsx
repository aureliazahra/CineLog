import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Props = {
  onClose: () => void
  onAdded: () => void
}

const moodOptions = ["hype", "sedih", "santai", "bored", "romantic"]
const genreOptions = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Animation"]

export default function AddMovieModal({ onClose, onAdded }: Props) {
  const [form, setForm] = useState({
    title: "",
    poster_url: "",
    genre: "",
    rating: 5,
    review: "",
    mood: "",
    watch_date: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title) return alert("Judul film wajib diisi!")
    setLoading(true)

    const { error } = await supabase.from("movies").insert([form])

    if (error) {
      alert("Gagal menambahkan film: " + error.message)
    } else {
      onAdded()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <h2 className="text-white text-xl font-bold">🎬 Tambah Film</h2>

        {/* Title */}
        <input
          name="title"
          placeholder="Judul film *"
          value={form.title}
          onChange={handleChange}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Poster URL */}
        <input
          name="poster_url"
          placeholder="URL poster (opsional)"
          value={form.poster_url}
          onChange={handleChange}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Genre */}
        <select
          name="genre"
          value={form.genre}
          onChange={handleChange}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">Pilih genre</option>
          {genreOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Rating */}
        <div className="space-y-1">
          <label className="text-zinc-400 text-sm">Rating: {form.rating}/10</label>
          <input
            type="range"
            name="rating"
            min={1}
            max={10}
            value={form.rating}
            onChange={handleChange}
            className="w-full accent-yellow-400"
          />
        </div>

        {/* Mood */}
        <div className="flex gap-2 flex-wrap">
          {moodOptions.map((m) => (
            <button
              key={m}
              onClick={() => setForm({ ...form, mood: m })}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                form.mood === m
                  ? "bg-yellow-400 text-black border-yellow-400 font-bold"
                  : "bg-zinc-800 text-white border-zinc-600 hover:border-yellow-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Review */}
        <textarea
          name="review"
          placeholder="Review singkat (opsional)"
          value={form.review}
          onChange={handleChange}
          rows={3}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />

        {/* Watch Date */}
        <input
          type="date"
          name="watch_date"
          value={form.watch_date}
          onChange={handleChange}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-zinc-600 text-zinc-400 hover:text-white hover:border-white transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  )
}