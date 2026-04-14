interface ModeCardProps {
  title: string
  description: string
  icon: string
  onClick: () => void
  badge?: string
  disabled?: boolean
}

export function ModeCard({ title, description, icon, onClick, badge, disabled }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        group relative flex flex-col gap-3 p-6 rounded-2xl text-left w-full
        bg-zinc-800/50 border border-zinc-700/50
        hover:bg-zinc-800 hover:border-zinc-600
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-all duration-200
      "
    >
      {badge && (
        <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          {badge}
        </span>
      )}

      <span className="text-3xl">{icon}</span>

      <div>
        <h2 className="text-white font-semibold text-base">{title}</h2>
        <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{description}</p>
      </div>

      <span className="text-zinc-600 group-hover:text-zinc-400 text-sm transition-colors mt-auto">
        Start →
      </span>
    </button>
  )
}
