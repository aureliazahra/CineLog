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

type Props = {
    movie: Movie
    onDelete: (id: string) => void
}

const moodEmoji: Record<string, string> = {
    hype: '😊',
    sad: '😢',
    chill: '😌',
    bored: '😴',    
    romantic: '😍'
}

export default function MovieCard({ movie, onDelete }: Props) {
    return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
      {/* Poster */}
        {movie.poster_url ? (
        <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-56 object-cover"
        />
        ) : (
        <div className="w-full h-56 bg-zinc-700 flex items-center justify-center text-zinc-400 text-sm">
            No Poster
        </div>
        )}

      {/* Info */}
        <div className="p-4 space-y-2">
        <h2 className="text-white font-bold text-lg leading-tight">{movie.title}</h2>

        <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            ⭐ {movie.rating}/10
            </span>
            <span className="bg-zinc-700 text-white text-xs px-2 py-1 rounded-full">
            {movie.genre}
            </span>
            {movie.mood && (
            <span className="bg-zinc-700 text-white text-xs px-2 py-1 rounded-full">
                {moodEmoji[movie.mood] ?? "🎬"} {movie.mood}
            </span>
            )}
        </div>

        {movie.review && (
            <p className="text-zinc-400 text-sm line-clamp-2">{movie.review}</p>
        )}

        {movie.watch_date && (
            <p className="text-zinc-500 text-xs">📅 {movie.watch_date}</p>
        )}

        <button
            onClick={() => onDelete(movie.id)}
            className="mt-2 w-full text-red-400 hover:text-red-300 text-sm border border-red-400 hover:border-red-300 rounded-lg py-1 transition-colors"
        >
            Hapus
        </button>
        </div>
    </div>
    )
}