// ─── Structured blocks that live inline in chat messages ──────────────────
//
// A block is a piece of structured data (an API contract, a data schema, ...)
// that the candidate commits to during the interview. It's embedded in the
// plain-text message content between <block>...</block> tags so it can:
//   1. Be rendered as a card in the chat UI
//   2. Be sent to Claude as text it can read and critique
//   3. Be persisted to the DB with zero schema changes

export type PhaseId = 'requirements' | 'hld' | 'api' | 'data' | 'scale' | 'failures'

export const PHASES: { id: PhaseId; label: string }[] = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'hld', label: 'High-level design' },
  { id: 'api', label: 'API contract' },
  { id: 'data', label: 'Data model' },
  { id: 'scale', label: 'Scale' },
  { id: 'failures', label: 'Failure modes' },
]

export interface APIContractBlock {
  type: 'api_contract'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  requestBody: string    // freeform — e.g. TypeScript-style shape
  responseBody: string
  statusCodes: string    // freeform list — e.g. "201, 400, 409"
}

export interface DataSchemaBlock {
  type: 'data_schema'
  tableName: string
  fields: Array<{ name: string; type: string; notes: string }>
  indexes: string        // freeform
}

export type Block = APIContractBlock | DataSchemaBlock

// An Artifact is a block with an ID so we can find & update it from the panel
export interface Artifact {
  id: string
  block: Block
}

// Short display label derived from the block's contents
export function artifactLabel(block: Block): string {
  if (block.type === 'api_contract') {
    return `${block.method} ${block.path || '(no path)'}`
  }
  if (block.type === 'data_schema') {
    return block.tableName || '(unnamed table)'
  }
  return 'Artifact'
}

export function artifactKind(block: Block): string {
  if (block.type === 'api_contract') return 'API contract'
  if (block.type === 'data_schema') return 'Data schema'
  return 'Artifact'
}

// Prepend an artifact snapshot to an outgoing user message so Claude always
// has the current state without the user needing to re-share blocks.
export function wrapMessageWithArtifacts(prose: string, artifacts: Artifact[]): string {
  if (artifacts.length === 0) return prose
  const blocks = artifacts.map(a => serializeBlock(a.block)).join('\n')
  return `<current_artifacts>\n${blocks}\n</current_artifacts>\n\n${prose}`
}

// Strip the artifacts envelope from content for display in the chat bubble.
// Also handles partial mid-stream tags so nothing leaks into the UI.
export function stripArtifactsTag(content: string): string {
  return content
    .replace(/<current_artifacts>[\s\S]*?<\/current_artifacts>/g, '')
    .replace(/<current_artifacts>[\s\S]*$/, '')
    .trim()
}

// ─── Serialization ───────────────────────────────────────────────────────
// Blocks live in message text wrapped in <block type="..."> tags holding JSON.
// We keep it as JSON (not custom syntax) because it round-trips cleanly and
// Claude can parse it reliably without ambiguity.

export function serializeBlock(block: Block): string {
  return `<block type="${block.type}">${JSON.stringify(block)}</block>`
}

// Segments let us walk through a message alternating between prose and blocks.
export type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'block'; value: Block }

const BLOCK_RE = /<block\s+type="([^"]+)">([\s\S]*?)<\/block>/g

export function parseMessageSegments(content: string): Segment[] {
  const segments: Segment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  BLOCK_RE.lastIndex = 0
  while ((match = BLOCK_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim()
      if (text) segments.push({ kind: 'text', value: text })
    }

    try {
      const parsed = JSON.parse(match[2]) as Block
      segments.push({ kind: 'block', value: parsed })
    } catch {
      // Malformed block — treat as raw text so we don't lose anything
      segments.push({ kind: 'text', value: match[0] })
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim()
    if (text) segments.push({ kind: 'text', value: text })
  }

  return segments
}

// ─── Phase-covered tag parsing ───────────────────────────────────────────
// Claude emits <phases_covered>id,id,...</phases_covered> at the end of its
// response to signal which phases have been covered so far. We strip this tag
// from the visible content and extract the ID list.

const PHASES_RE = /<phases_covered>\s*([^<]*)\s*<\/phases_covered>/

export function extractPhases(content: string): { stripped: string; phases: PhaseId[] } {
  const match = content.match(PHASES_RE)
  if (!match) return { stripped: content, phases: [] }

  const ids = match[1]
    .split(',')
    .map(s => s.trim())
    .filter((s): s is PhaseId => PHASES.some(p => p.id === s))

  const stripped = content.replace(PHASES_RE, '').trim()
  return { stripped, phases: ids }
}
