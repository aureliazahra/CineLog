"use client"

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
    genre: "",
    rating: 5,
    review: "",
    mood: "",
    watch_date: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return alert("File harus berupa gambar!")
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }

  const handleSubmit = async () => {
    if (!form.title) return alert("Judul film wajib diisi!")
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user_id = userData.user?.id

    let poster_url = ""

    if (imageFile) {
      const ext = imageFile.name.split(".").pop()
      const fileName = `${user_id}_${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from("posters")
        .upload(fileName, imageFile)

      if (uploadError) {
        alert("Gagal upload gambar: " + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from("posters").getPublicUrl(fileName)
      poster_url = urlData.publicUrl
    }

    const { error } = await supabase.from("movies").insert([{ ...form, poster_url, user_id }])

    if (error) {
      alert("Gagal menambahkan film: " + error.message)
    } else {
      onAdded()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl my-auto">
        <h2 className="text-white text-xl font-bold">🎬 Tambah Film</h2>

        {/* Image Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => document.getElementById("poster-input")?.click()}
          className={`w-full h-40 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${
            dragging ? "border-yellow-400 bg-yellow-400/10" : "border-zinc-600 hover:border-yellow-400"
          }`}
        >
          {imagePreview ? (
            <img src={imagePreview} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-zinc-500 text-sm">
              <p className="text-2xl mb-1">🖼️</p>
              <p>Drop poster di sini atau klik untuk pilih</p>
            </div>
          )}
        </div>
        <input
          id="poster-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
        />

        {/* Title */}
        <input
          name="title"
          placeholder="Judul film *"
          value={form.title}
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
          {genreOptions.map((g) => <option key={g} value={g}>{g}</option>)}
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