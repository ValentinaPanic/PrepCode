type Accent = 'indigo' | 'amber' | 'emerald'

interface ModeCardProps {
  title: string
  description: string
  icon: string
  onClick: () => void
  badge?: string
  disabled?: boolean
  detail?: string
  accent?: Accent
  featured?: boolean
}

const accentStyles: Record<Accent, { iconBg: string; ring: string; cta: string }> = {
  indigo: {
    iconBg: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
    ring: 'group-hover:ring-indigo-400/40',
    cta: 'text-indigo-600 dark:text-indigo-400',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    ring: 'group-hover:ring-amber-400/40',
    cta: 'text-amber-600 dark:text-amber-400',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    ring: 'group-hover:ring-emerald-400/40',
    cta: 'text-emerald-600 dark:text-emerald-400',
  },
}

export function ModeCard({
  title,
  description,
  icon,
  onClick,
  badge,
  disabled,
  detail,
  accent = 'indigo',
  featured = false,
}: ModeCardProps) {
  const styles = accentStyles[accent]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative flex flex-col gap-4 p-6 rounded-2xl text-left w-full
        bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50
        ring-1 ring-transparent ${styles.ring}
        hover:border-zinc-300 dark:hover:border-zinc-600 hover:-translate-y-0.5
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-all duration-200
        ${featured ? 'md:col-span-2' : ''}
      `}
    >
      {badge && (
        <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          {badge}
        </span>
      )}

      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${styles.iconBg}`}>
        {icon}
      </div>

      <div>
        <h2 className="text-zinc-900 dark:text-white font-semibold text-base">{title}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1.5 leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className={`text-sm font-medium ${styles.cta} opacity-70 group-hover:opacity-100 transition-opacity`}>
          Start →
        </span>
        {detail && (
          <span className="text-zinc-500 dark:text-zinc-500 text-xs font-mono">{detail}</span>
        )}
      </div>
    </button>
  )
}
