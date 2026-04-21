import { useState } from 'react'
import type { APIContractBlock } from '../../lib/blocks'

interface Props {
  onSubmit: (block: APIContractBlock) => void
  initial?: APIContractBlock
  submitLabel?: string
}

const METHODS: APIContractBlock['method'][] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export function APIContractForm({ onSubmit, initial, submitLabel = 'Save artifact' }: Props) {
  const [method, setMethod] = useState<APIContractBlock['method']>(initial?.method ?? 'POST')
  const [path, setPath] = useState(initial?.path ?? '')
  const [requestBody, setRequestBody] = useState(initial?.requestBody ?? '')
  const [responseBody, setResponseBody] = useState(initial?.responseBody ?? '')
  const [statusCodes, setStatusCodes] = useState(initial?.statusCodes ?? '')

  const canSubmit = path.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      type: 'api_contract',
      method,
      path: path.trim(),
      requestBody: requestBody.trim(),
      responseBody: responseBody.trim(),
      statusCodes: statusCodes.trim(),
    })
  }

  return (
    <div className="flex flex-col gap-3">
        {/* Method + path row */}
        <div className="flex gap-2">
          <select
            value={method}
            onChange={e => setMethod(e.target.value as APIContractBlock['method'])}
            className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            value={path}
            onChange={e => setPath(e.target.value)}
            placeholder="/orders/:id"
            className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
          />
        </div>

        <FormField
          label="Request body"
          value={requestBody}
          onChange={setRequestBody}
          placeholder={'{\n  userId: string,\n  items: Array<{ id, qty }>\n}'}
          rows={3}
        />
        <FormField
          label="Response body"
          value={responseBody}
          onChange={setResponseBody}
          placeholder={'{\n  orderId: string,\n  status: "pending" | "confirmed"\n}'}
          rows={3}
        />
        <FormField
          label="Status codes"
          value={statusCodes}
          onChange={setStatusCodes}
          placeholder="201 Created, 400 Bad Request, 409 Conflict"
          rows={1}
        />

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

function FormField({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  rows: number
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400 resize-none"
      />
    </label>
  )
}
