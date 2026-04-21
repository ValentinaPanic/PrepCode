import { useEffect, useState, useCallback, useMemo } from 'react'
import { useClaude } from '../hooks/useClaude'
import { useApiKey } from '../contexts/ApiKeyContext'
import { Nav } from '../components/Nav'
import { ChatWindow } from '../components/ChatWindow'
import { InputBar } from '../components/InputBar'
import { SystemDesignSetup } from '../components/system-design/SystemDesignSetup'
import { SessionList } from '../components/system-design/SessionList'
import { CoverageTracker } from '../components/system-design/CoverageTracker'
import { ArtifactsPanel } from '../components/system-design/ArtifactsPanel'
import { ArtifactEditor } from '../components/system-design/ArtifactEditor'
import { systemDesignPrompt } from '../prompts/systemDesign'
import { findTopic, type SystemDesignTopic } from '../data/systemDesignTopics'
import {
  extractPhases,
  wrapMessageWithArtifacts,
  artifactKind,
  type Artifact,
  type Block,
  type PhaseId,
} from '../lib/blocks'
import type { SessionSummary, SessionWithMessages, Message } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const ACTIVE_SESSION_KEY = 'prepcode-active-system-design-session'
const artifactsKey = (sessionId: string) => `prepcode-artifacts-${sessionId}`

type Phase = 'hydrating' | 'setup' | 'resume_picker' | 'active'

// Discriminated union so the editor knows whether to start empty or pre-fill
type EditorState =
  | { kind: 'create'; type: Block['type'] }
  | { kind: 'edit'; artifact: Artifact }

export function SystemDesign() {
  const [phase, setPhase] = useState<Phase>('hydrating')
  const [activeTopic, setActiveTopic] = useState<SystemDesignTopic | null>(null)
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [editor, setEditor] = useState<EditorState | null>(null)
  const { hasKey, openModal } = useApiKey()

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    reset,
    loadSession,
    attachSession,
    sessionId,
  } = useClaude(systemDesignPrompt, 'system_design')

  // Coverage is cumulative — pull the latest assistant message's tag
  const coveredPhases = useMemo<PhaseId[]>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.role !== 'assistant') continue
      const { phases } = extractPhases(m.content)
      if (phases.length > 0) return phases
    }
    return []
  }, [messages])

  // ─── Persist artifacts per-session to localStorage ──────────────────────
  // localStorage is the source of truth for artifacts — they aren't a separate
  // DB table, they just ride along with each user message inside the
  // <current_artifacts> envelope. Saving per-session key avoids leaking
  // artifacts from one resumed session into another.
  useEffect(() => {
    if (!sessionId || phase !== 'active') return
    localStorage.setItem(artifactsKey(sessionId), JSON.stringify(artifacts))
  }, [artifacts, sessionId, phase])

  const loadArtifactsForSession = (id: string) => {
    try {
      const raw = localStorage.getItem(artifactsKey(id))
      setArtifacts(raw ? (JSON.parse(raw) as Artifact[]) : [])
    } catch {
      setArtifacts([])
    }
  }

  // ─── Send helper that always wraps prose with the current artifacts ─────
  const sendWithArtifacts = useCallback(
    (prose: string) => {
      sendMessage(wrapMessageWithArtifacts(prose, artifacts))
    },
    [sendMessage, artifacts],
  )

  // ─── Fetch list of past sessions (used both for resume and setup toggle) ──
  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/sessions`)
      const data: SessionSummary[] = await res.json()
      setSessions(data.filter(s => s.mode === 'system_design'))
    } catch (err) {
      console.error('Failed to fetch sessions', err)
    } finally {
      setSessionsLoading(false)
    }
  }, [])

  // ─── On mount: try to hydrate from a stored active session ──────────────
  useEffect(() => {
    const storedId = localStorage.getItem(ACTIVE_SESSION_KEY)
    if (!storedId) {
      setPhase('setup')
      fetchSessions()
      return
    }

    // Try to hydrate the stored session from the server
    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/${storedId}`)
        if (!res.ok) throw new Error('Session not found')
        const session: SessionWithMessages = await res.json()
        const history: Message[] = session.messages.map(m => ({
          role: m.role,
          content: m.content,
        }))
        loadSession(session.id, history)
        loadArtifactsForSession(session.id)
        if (session.topic) setActiveTopic(findTopic(session.topic) ?? null)
        setPhase('active')
        fetchSessions()
      } catch {
        localStorage.removeItem(ACTIVE_SESSION_KEY)
        setPhase('setup')
        fetchSessions()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Start a new session with a topic ───────────────────────────────────
  const handleStart = async (topic: SystemDesignTopic) => {
    try {
      const res = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'system_design', topic: topic.id }),
      })
      const session = await res.json()
      attachSession(session.id)
      localStorage.setItem(ACTIVE_SESSION_KEY, session.id)
      setArtifacts([])
      setActiveTopic(topic)
      setPhase('active')
      // Starter prompt has no artifacts yet — send as plain prose
      sendMessage(topic.starterPrompt)
    } catch (err) {
      console.error('Failed to start session', err)
    }
  }

  // ─── Resume a past session from the list ────────────────────────────────
  const handleResume = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}`)
      const session: SessionWithMessages = await res.json()
      const history: Message[] = session.messages.map(m => ({
        role: m.role,
        content: m.content,
      }))
      loadSession(session.id, history)
      loadArtifactsForSession(session.id)
      if (session.topic) setActiveTopic(findTopic(session.topic) ?? null)
      localStorage.setItem(ACTIVE_SESSION_KEY, session.id)
      setPhase('active')
    } catch (err) {
      console.error('Failed to resume session', err)
    }
  }

  // ─── End the active session and return to setup ─────────────────────────
  const handleEndSession = () => {
    if (sessionId) localStorage.removeItem(artifactsKey(sessionId))
    localStorage.removeItem(ACTIVE_SESSION_KEY)
    reset()
    setActiveTopic(null)
    setArtifacts([])
    setPhase('setup')
    fetchSessions()
  }

  // ─── Delete a session from the past-sessions list ───────────────────────
  const handleDelete = async (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (localStorage.getItem(ACTIVE_SESSION_KEY) === id) {
      localStorage.removeItem(ACTIVE_SESSION_KEY)
    }
    localStorage.removeItem(artifactsKey(id))

    try {
      const res = await fetch(`${API_URL}/api/sessions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    } catch (err) {
      console.error('Failed to delete session', err)
      fetchSessions()
    }
  }

  // ─── Artifact CRUD ───────────────────────────────────────────────────────
  // On save we also fire a short prose message so Claude knows the candidate
  // just committed (or changed) something — the artifact state itself rides
  // along in the <current_artifacts> envelope that sendWithArtifacts adds.
  const handleArtifactSave = (block: Block) => {
    if (!editor) return

    let ping = ''
    let nextArtifacts: Artifact[]

    if (editor.kind === 'create') {
      const newArtifact: Artifact = { id: crypto.randomUUID(), block }
      nextArtifacts = [...artifacts, newArtifact]
      ping = `I added a new ${artifactKind(block).toLowerCase()} artifact. Please review.`
    } else {
      nextArtifacts = artifacts.map(a =>
        a.id === editor.artifact.id ? { ...a, block } : a,
      )
      ping = `I updated the ${artifactKind(block).toLowerCase()} artifact. Please re-review.`
    }

    setArtifacts(nextArtifacts)
    setEditor(null)
    // Send the ping with the *new* artifact list, not the stale one from the
    // closure — artifacts state won't be flushed until the next render.
    sendMessage(wrapMessageWithArtifacts(ping, nextArtifacts))
  }

  const handleArtifactDelete = (id: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== id))
  }

  // System Design always needs a live Claude connection — gate it behind a
  // key. Existing sessions would just fail on every send without one.
  if (!hasKey) {
    return (
      <div className="flex flex-col h-full">
        <Nav subtitle="System Design" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-zinc-900 dark:text-white text-xl font-semibold mb-2">
              System Design needs an API key
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-5 leading-relaxed">
              This mode runs a live interview with Claude, so it can't fall back to
              static content. Add your Anthropic key to get started — it stays in your
              browser.
            </p>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Set up API key
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Nav subtitle="System Design" />

      {phase === 'hydrating' && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500 text-sm">Loading your session...</p>
        </div>
      )}

      {phase === 'setup' && (
        <SystemDesignSetup
          onStart={handleStart}
          onShowPastSessions={() => setPhase('resume_picker')}
          hasPastSessions={sessions.length > 0}
        />
      )}

      {phase === 'resume_picker' && (
        <SessionList
          sessions={sessions}
          onResume={handleResume}
          onDelete={handleDelete}
          onBack={() => setPhase('setup')}
          isLoading={sessionsLoading}
        />
      )}

      {phase === 'active' && (
        <>
          {/* Pinned session banner — problem stays visible and End session is always reachable */}
          <div className="px-8 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-indigo-50/50 dark:bg-indigo-500/5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
                  Topic
                </p>
                <h2 className="text-zinc-900 dark:text-white font-semibold text-sm truncate">
                  {activeTopic?.label ?? 'Untitled session'}
                </h2>
              </div>
              <button
                onClick={handleEndSession}
                className="shrink-0 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-md transition-colors"
              >
                End session
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-4 px-4 py-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-1 min-h-0">
            <ArtifactsPanel
              artifacts={artifacts}
              onCreate={type => setEditor({ kind: 'create', type })}
              onEdit={artifact => setEditor({ kind: 'edit', artifact })}
              onDelete={handleArtifactDelete}
            />
            <div className="flex flex-col flex-1 min-w-0">
              <ChatWindow messages={messages} isLoading={isLoading} />
              <InputBar
                onSend={sendWithArtifacts}
                isLoading={isLoading}
                placeholder="Describe your design..."
              />
            </div>
            <CoverageTracker covered={coveredPhases} />
          </div>

          {editor && (
            <ArtifactEditor
              mode={editor}
              onSave={handleArtifactSave}
              onClose={() => setEditor(null)}
            />
          )}
        </>
      )}
    </div>
  )
}
