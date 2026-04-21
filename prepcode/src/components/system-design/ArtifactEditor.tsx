import { useEffect } from 'react'
import type { Artifact, Block } from '../../lib/blocks'
import { APIContractForm } from './APIContractForm'
import { DataSchemaForm } from './DataSchemaForm'

// The editor can open in two modes:
//   • create — starts from an empty form for a given block type
//   • edit   — pre-fills the form from an existing artifact
type Mode =
  | { kind: 'create'; type: Block['type'] }
  | { kind: 'edit'; artifact: Artifact }

interface Props {
  mode: Mode
  onSave: (block: Block) => void
  onClose: () => void
}

export function ArtifactEditor({ mode, onSave, onClose }: Props) {
  // Close on Escape — common modal affordance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const blockType = mode.kind === 'create' ? mode.type : mode.artifact.block.type
  const title = blockType === 'api_contract' ? '📋 API Contract' : '🗃 Data Schema'
  const submitLabel = mode.kind === 'create' ? 'Save artifact' : 'Update artifact'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {title}
          </p>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-lg leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {blockType === 'api_contract' && (
            <APIContractForm
              onSubmit={onSave}
              initial={mode.kind === 'edit' ? (mode.artifact.block as Extract<Block, { type: 'api_contract' }>) : undefined}
              submitLabel={submitLabel}
            />
          )}
          {blockType === 'data_schema' && (
            <DataSchemaForm
              onSubmit={onSave}
              initial={mode.kind === 'edit' ? (mode.artifact.block as Extract<Block, { type: 'data_schema' }>) : undefined}
              submitLabel={submitLabel}
            />
          )}
        </div>
      </div>
    </div>
  )
}
