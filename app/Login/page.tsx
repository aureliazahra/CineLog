"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError("Cek email kamu untuk konfirmasi!")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push("/")
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000" }
    })
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-sm space-y-5 shadow-2xl">
        <div className="text-center">
          <h1 className="text-yellow-400 font-black text-3xl">🎬 CineLog</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {isRegister ? "Buat akun baru" : "Masuk ke watchlist kamu"}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
          Lanjut dengan Google
        </button>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-zinc-700" />
          <span className="text-zinc-500 text-xs">atau</span>
          <hr className="flex-1 border-zinc-700" />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {error && (
          <p className="text-sm text-center text-red-400">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-bold py-2.5 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : isRegister ? "Daftar" : "Masuk"}
        </button>

        <p className="text-center text-zinc-500 text-sm">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-yellow-400 hover:underline"
          >
            {isRegister ? "Masuk" : "Daftar"}
          </button>
        </p>
      </div>
    </main>
  )
}