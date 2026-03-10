"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <h1 className="text-yellow-400 font-black text-2xl tracking-tight">
        🎬 CineLog
      </h1>
      <div className="flex items-center gap-4">
        {email && (
          <span className="text-zinc-400 text-sm hidden sm:block">{email}</span>
        )}
        <button
          onClick={() => router.push("/stats")}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          📊 Stats
        </button>
        <button
          onClick={handleLogout}
          className="text-sm border border-zinc-600 text-zinc-300 hover:text-white hover:border-white px-4 py-1.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
