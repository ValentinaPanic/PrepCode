import { useNavigate } from 'react-router-dom'
import { ModeCard } from '../components/ModeCard'

export function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-12 pb-8">
        <h1 className="text-2xl font-bold text-white">PrepCode</h1>
        <p className="text-zinc-400 text-sm mt-1">Frontend interview practice, one session at a time.</p>
      </div>

      {/* Mode grid */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ModeCard
          title="System Design"
          description="Back and forth with a strict AI interviewer. API contracts, architecture, failure states — nothing gets skipped."
          icon="🏗️"
          onClick={() => navigate('/system-design')}
        />
        <ModeCard
          title="Quiz"
          description="Quick-fire questions on React, JavaScript, TypeScript, and CSS. Good for warming up or filling gaps."
          icon="⚡"
          onClick={() => navigate('/quiz')}
          badge="Coming soon"
          disabled
        />
        <ModeCard
          title="Component Practice"
          description="Build accessible HTML components from scratch — button, form, input, nav, and more. Scored on correctness."
          icon="🧩"
          onClick={() => navigate('/components')}
          badge="Coming soon"
          disabled
        />
      </div>
    </div>
  )
}
