# PrepCode

A frontend-interview prep app built around how interviews actually run: talking through system designs, rapid-fire fundamentals, and writing real components. Less passive reading, more pressure.

Built as a learning project — the code is meant to be read.

---

## Modes

**System Design** — A live interview with Claude. Pick a topic, commit to API contracts and data schemas as structured artifacts, and defend your choices. The interviewer pushes back on vague answers and tracks which design phases you've covered.

**Quiz** — Rapid-fire on React, JavaScript, TypeScript, and CSS. Claude generates questions, you answer, and get a streaming explanation of why. Works without an API key too — falls back to a static bank of ~60 seeded questions.

**Component Practice** — Write accessible HTML + CSS from scratch. Ten challenges (button, form, nav, card, etc.), rendered in a sandboxed iframe and scored on semantics and a11y. No AI needed.

---

## Bring your own API key

Because this is a public portfolio app, PrepCode uses **your** Anthropic API key for Claude calls. On first visit you'll see a modal explaining it:

- Stored in your browser only (localStorage or sessionStorage — your choice)
- Sent as an `x-api-key` header to the PrepCode server, which forwards it to Anthropic
- Never logged, never stored server-side

You can [get a key at console.anthropic.com](https://console.anthropic.com/settings/keys) — set a monthly spend limit ($5 is plenty) so you're safe from surprise charges.

Quiz and Component Practice still work without a key.

---

## Architecture

```
Vercel (frontend)          Render (backend)          Supabase (database)
React + Vite + TS          Node + Express            managed Postgres
     |                          |                          |
     └──── VITE_API_URL ────────┘                          │
                                └───── SUPABASE_URL ───────┘
```

- **Frontend** is a static Vite build deployed to Vercel.
- **Backend** is a persistent Node process on Render — serverless doesn't work for Claude streaming (10s timeouts cut mid-response).
- **Database** is Supabase; sessions and messages persist so you can resume past interviews.

---

## Things worth looking at

These are the bits that make the app interesting as a code sample:

- **Streaming Server-Sent Events** from Claude → Express → `ReadableStreamDefaultReader` in the browser. See [server/src/routes/chat.ts](server/src/routes/chat.ts) and [prepcode/src/hooks/useClaude.ts](prepcode/src/hooks/useClaude.ts).
- **BYOK factory pattern** — server creates a per-request Anthropic client from the `x-api-key` header, falling back to a server env var. See [server/src/services/claude.ts](server/src/services/claude.ts).
- **Graceful degradation** — the quiz route transparently falls back to a seeded Supabase table when no API key is available, and the frontend handles either a streaming or JSON response via content-type sniffing. See [server/src/routes/quiz.ts](server/src/routes/quiz.ts).
- **System Design artifact state** — structured artifacts (API contracts, data schemas) live in a side panel, not in chat. They're edited in place and piggyback onto every outgoing message as a `<current_artifacts>` envelope the prompt treats as authoritative. See [prepcode/src/modes/SystemDesign.tsx](prepcode/src/modes/SystemDesign.tsx) and [prepcode/src/lib/blocks.ts](prepcode/src/lib/blocks.ts).
- **Quiz as a state machine** — a single `phase` field drives every UI decision instead of juggling booleans. See [prepcode/src/hooks/useQuiz.ts](prepcode/src/hooks/useQuiz.ts).
- **Sandboxed iframe + postMessage** — Component Practice runs user code in a `sandbox="allow-scripts"` iframe and reads the DOM back via `postMessage` because `contentDocument` access is blocked across sandbox boundaries. See [prepcode/src/components/component-practice/PreviewPane.tsx](prepcode/src/components/component-practice/PreviewPane.tsx).

---

## Running locally

### Prerequisites
- Node 20+
- An Anthropic API key (optional for most modes; required for System Design)
- A Supabase project — free tier is fine

### Setup

```bash
git clone https://github.com/ValentinaPanic/PrepCode.git
cd PrepCode
```

**Server:**
```bash
cd server
npm install
```

Create `server/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...          # optional — users can BYOK instead
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
CLIENT_URL=http://localhost:5173
PORT=3001
```

Run the Supabase schema (see `server/schema.sql` — or create `sessions`, `messages`, `quiz_questions` tables matching the app's expectations).

Optionally seed the quiz fallback bank:
```bash
npm run seed:quiz
```

Start the server:
```bash
npm run dev
```

**Frontend:**
```bash
cd prepcode
npm install
```

Create `prepcode/.env`:
```
VITE_API_URL=http://localhost:3001
```

Start the dev server:
```bash
npm run dev
```

Open http://localhost:5173.

---

## Project structure

```
prepcode/                        Frontend (Vite + React + TS)
  src/
    modes/                       One component per mode
    screens/                     HomeScreen
    components/                  UI pieces — generic and mode-scoped
    hooks/                       useClaude, useQuiz, useTheme, useStats
    contexts/                    ApiKeyContext
    prompts/                     Claude system prompts
    lib/                         Shared helpers (artifact protocol, spec checks)
    data/                        Static content (topics, challenges)
    types.ts                     Shared type definitions

server/                          Backend (Node + Express + TS)
  src/
    routes/                      chat, sessions, quiz, challenges
    services/                    Anthropic client factory, Supabase client
    prompts/                     Server-side prompts
    scripts/                     One-off scripts (quiz seeding)

Notes.md                         Running notes — the things learned while building
DEVLOG.md                        Timeline of decisions
```

---

## Tech

- **Frontend:** React 19, React Router 7, TypeScript, Tailwind CSS v4, Vite, CodeMirror 6
- **Backend:** Node, Express, TypeScript, Anthropic SDK
- **Data:** Supabase (Postgres)
- **Hosting:** Vercel (frontend), Render (backend)

---

## License

MIT
