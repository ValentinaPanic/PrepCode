import { useState } from 'react'
import type { Artifact, Block } from '../../lib/blocks'
import { artifactLabel, artifactKind } from '../../lib/blocks'

interface Props {
  artifacts: Artifact[]
  onCreate: (type: Block['type']) => void
  onEdit: (artifact: Artifact) => void
  onDelete: (id: string) => void
}

export function ArtifactsPanel({ artifacts, onCreate, onEdit, onDelete }: Props) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <aside className="w-72 shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden hidden md:flex">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wide">
          Artifacts
        </h3>
        <div className="relative">
          <button
            onClick={() => setAddOpen(open => !open)}
            className="text-xs px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            + Add
          </button>
          {addOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => { onCreate('api_contract'); setAddOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                📋 API Contract
              </button>
              <button
                onClick={() => { onCreate('data_schema'); setAddOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                🗃 Data Schema
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {artifacts.length === 0 ? (
          <div className="px-2 py-8">
            <p className="text-zinc-500 dark:text-zinc-500 text-xs leading-relaxed">
              Commit your design decisions here. Artifacts stay visible and editable throughout the interview — the interviewer references them as you go.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {artifacts.map(artifact => (
              <li
                key={artifact.id}
                className="group relative rounded-lg bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-colors"
              >
                <button
                  onClick={() => onEdit(artifact)}
                  className="w-full text-left p-3 pr-9"
                >
                  <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-1">
                    {artifactKind(artifact.block)}
                  </p>
                  <p className="font-mono text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {artifactLabel(artifact.block)}
                  </p>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this artifact?')) onDelete(artifact.id)
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  aria-label="Delete artifact"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
