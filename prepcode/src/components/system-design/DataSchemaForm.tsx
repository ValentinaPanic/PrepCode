import { useState } from 'react'
import type { DataSchemaBlock } from '../../lib/blocks'

interface Props {
  onSubmit: (block: DataSchemaBlock) => void
  initial?: DataSchemaBlock
  submitLabel?: string
}

type Field = DataSchemaBlock['fields'][number]

const emptyField = (): Field => ({ name: '', type: '', notes: '' })

export function DataSchemaForm({ onSubmit, initial, submitLabel = 'Save artifact' }: Props) {
  const [tableName, setTableName] = useState(initial?.tableName ?? '')
  const [fields, setFields] = useState<Field[]>(
    initial && initial.fields.length > 0 ? initial.fields : [emptyField(), emptyField()]
  )
  const [indexes, setIndexes] = useState(initial?.indexes ?? '')

  const canSubmit = tableName.trim().length > 0 && fields.some(f => f.name.trim().length > 0)

  const updateField = (i: number, patch: Partial<Field>) => {
    setFields(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f))
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      type: 'data_schema',
      tableName: tableName.trim(),
      fields: fields
        .filter(f => f.name.trim().length > 0)
        .map(f => ({ name: f.name.trim(), type: f.type.trim(), notes: f.notes.trim() })),
      indexes: indexes.trim(),
    })
  }

  return (
    <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Table name</span>
          <input
            value={tableName}
            onChange={e => setTableName(e.target.value)}
            placeholder="orders"
            className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Fields</span>
          {fields.map((field, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                value={field.name}
                onChange={e => updateField(i, { name: e.target.value })}
                placeholder="id"
                className="col-span-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
              <input
                value={field.type}
                onChange={e => updateField(i, { type: e.target.value })}
                placeholder="uuid"
                className="col-span-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
              <input
                value={field.notes}
                onChange={e => updateField(i, { notes: e.target.value })}
                placeholder="primary key, not null"
                className="col-span-6 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
            </div>
          ))}
          <button
            onClick={() => setFields(prev => [...prev, emptyField()])}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline self-start"
          >
            + Add field
          </button>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Indexes</span>
          <input
            value={indexes}
            onChange={e => setIndexes(e.target.value)}
            placeholder="idx_orders_user_id (user_id), unique on (stripe_id)"
            className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
          />
        </label>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {submitLabel}
          </button>
        </div>
    </div>
  )
}
