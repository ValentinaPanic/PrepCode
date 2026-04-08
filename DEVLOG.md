# PrepCode — Build Log & Reference

A running guide of every step taken to build PrepCode, with explanations of what each thing does and why.

---

## The Big Picture

PrepCode is a full-stack interview prep app. Here's how all the pieces connect:

```
Browser (React) → Your Server (Node/Express) → Anthropic API (Claude)
                                              → Supabase (Postgres database)
```

The browser never talks directly to Anthropic or the database — everything goes through your server. This keeps API keys secure and gives you a real backend to learn from.

---

## Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | React + TypeScript + Tailwind | Your existing strength |
| Backend | Node.js + Express + TypeScript | Learn API design hands-on |
| Database | Supabase (Postgres) | Real DB, minimal setup, built-in auth for future |
| AI | Anthropic API (Claude) | Powers all three modes |

---

## Project Structure

```
PrepCode/
  prepcode/          — React frontend
    src/
      hooks/         — useClaude.ts (API calls)
      prompts/       — system prompts per mode
      modes/         — SystemDesign, CodingChallenge, Quiz
      components/    — shared UI (ChatWindow, InputBar, etc.)
  server/            — Node.js + Express backend
    src/
      routes/        — API endpoints (/api/chat, /api/sessions, /api/challenges)
      services/      — claude.ts, supabase.ts (business logic)
      index.ts       — entry point, starts the server
```

---

## Build Plan

### Phase 1 — Backend foundation
- [ ] 1. Scaffold `server/` with Node.js + Express + TypeScript
- [ ] 2. Set up Supabase project + database schema
- [ ] 3. Build `/api/chat` route — proxies messages to Claude
- [ ] 4. Build `/api/sessions` routes — save + retrieve sessions
- [ ] 5. Build `/api/challenges` routes — save and fetch challenges

### Phase 2 — Frontend core
- [ ] 6. Update `useClaude.ts` to call your own server instead of Anthropic directly
- [ ] 7. Build shared components: `ChatWindow`, `MessageBubble`, `InputBar`
- [ ] 8. Write System Design prompt
- [ ] 9. Build System Design mode UI
- [ ] 10. Build `ModeSelector` home screen + wire up `App.tsx`

### Phase 3 — More modes
- [ ] 11. Coding Challenge mode
- [ ] 12. Quiz / Flashcard mode

### Phase 4 — History & polish
- [ ] 13. Session history page
- [ ] 14. Offline challenge practice (from saved DB challenges)
- [ ] 15. Design pass

---

## Step-by-Step Log

---

### Step 1 — Frontend scaffold (done)

```bash
npm create vite@latest prepcode -- --template react-ts
cd prepcode
npm install
npm run dev
```

**What this does:** Creates a React + TypeScript app using Vite as the build tool. Vite is faster than the old Create React App. Runs at `localhost:5173` by default.

---

### Step 2 — Add Tailwind CSS (done)

```bash
npm install -D tailwindcss @tailwindcss/vite
```

In `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

In `index.css` (replace everything):
```css
@import "tailwindcss";
```

**What this does:** Tailwind is a utility-first CSS framework — instead of writing `.card { padding: 16px }` you write `className="p-4"` directly in your JSX. Fast to build UI with once you know the class names.

---

### Step 3 — Set up direnv for API key management (done)

```bash
brew install direnv
# Add to ~/.zshrc:
eval "$(direnv hook zsh)"
source ~/.zshrc

touch .envrc
# Inside .envrc:
export VITE_ANTHROPIC_API_KEY="sk-ant-your-key-here"

direnv allow .
echo ".envrc" >> .gitignore
```

**What this does:** `direnv` automatically loads environment variables when you `cd` into a folder, and unloads them when you leave. Your API key is never hardcoded in the source code. The `VITE_` prefix is required — Vite only exposes env vars with that prefix to the browser.

**Important:** Never commit `.envrc` or `.env` files. The key goes in `.gitignore` immediately.

---

### Step 4 — Folder structure (done)

Inside `prepcode/src/` create:
```
modes/
components/
hooks/
prompts/
```

**What this does:** Organizes the code by responsibility. `modes/` has the page-level components for each mode, `components/` has reusable UI pieces, `hooks/` has logic that can be shared across components, `prompts/` has the system prompt strings for each mode.

---

### Step 5 — Install Anthropic SDK on frontend (done, will move to server)

```bash
npm install @anthropic-ai/sdk
```

**Note:** This was installed on the frontend temporarily. Once the server is running, the API key and all Anthropic calls move to the server. The frontend will call your own `/api/chat` endpoint instead.

---

### Step 6 — useClaude.ts hook (done, will be updated)

`src/hooks/useClaude.ts` — a custom React hook that manages:
- The message history for a conversation
- Sending a message to Claude (streaming)
- Loading and error states
- A `reset()` function to start a new session

**What a custom hook is:** A function that starts with `use` and can use React state (`useState`, `useCallback`). It lets you extract logic out of components so multiple components can share it without duplicating code.

**What streaming is:** Instead of waiting for Claude to finish the entire response before showing it, streaming sends the response word by word as it's generated. That's why you see text appear progressively — better UX.

This hook will be updated in Phase 2 to call your server instead of Anthropic directly.

---

### Step 7 — Scaffold the server

```bash
cd /Users/valentinapanic/Desktop/Projects/PrepCode
mkdir server
cd server
npm init -y
```

**What `npm init -y` does:** Creates a `package.json` file — the manifest for your Node project. It tracks the project name, version, start scripts, and all dependencies. The `-y` skips the interactive questions and uses defaults.

---

### Step 8 — Install server dependencies

```bash
# Runtime dependencies (needed to run the app)
npm install express @supabase/supabase-js @anthropic-ai/sdk dotenv cors

# Dev dependencies (only needed during development)
npm install -D typescript ts-node @types/express @types/cors @types/node nodemon
```

**What each package does:**

| Package | What it does |
|---------|-------------|
| `express` | Framework for building your API — handles routes, requests, responses |
| `@supabase/supabase-js` | Official SDK to read/write your Supabase database |
| `@anthropic-ai/sdk` | Talks to Claude — same as frontend but now runs on server |
| `dotenv` | Loads `.env` file into `process.env` so your code can read API keys |
| `cors` | Allows your frontend (port 5173) to call your server (different port) — browsers block cross-origin requests by default |
| `typescript` | Adds types to JavaScript |
| `ts-node` | Runs TypeScript files directly without compiling to JS first |
| `@types/*` | Type definitions so TypeScript understands Express, Node, etc. |
| `nodemon` | Watches your files and restarts the server automatically on save — like hot reload for the backend |

---

---

### Step 9 — Configure TypeScript + start the server

**`tsconfig.json`** tells TypeScript how to compile your code:
- `target: ES2020` — what version of JavaScript to output
- `module: commonjs` — Node.js module format (vs ESM used in the browser)
- `outDir: ./dist` — where compiled JS goes
- `rootDir: ./src` — where your source TS lives
- `strict: true` — enables all strict type checks (catches more bugs)

**`package.json` scripts:**
- `npm run dev` — nodemon watches `src/`, restarts server on every save
- `npm run build` — compiles TS → JS into `dist/`
- `npm start` — runs compiled JS (production)

**`src/index.ts`** — the entry point:
- `dotenv.config()` — reads `.env` and loads values into `process.env`
- `express()` — creates the app
- `cors(...)` — allows requests from your React frontend only
- `express.json()` — parses JSON request bodies (without this, `req.body` is empty)
- `/health` endpoint — standard practice to confirm server is alive

**Test:** `http://localhost:3001/health` → `{"status":"ok"}`

---

## ⚠️ TODO Before Deploying

### CORS origin must be updated for production

Currently hardcoded to `localhost:5173`. Before deploying, change to:

```ts
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
```

Then set `CLIENT_URL=https://your-deployed-frontend-url.com` in your production environment variables.

---

---

### Step 10 — Shared UI components

Three reusable components used by all modes:

**`MessageBubble.tsx`** — renders one message. User = right-aligned indigo, assistant = left-aligned dark. `whitespace-pre-wrap` preserves line breaks.

**`ChatWindow.tsx`** — scrollable message list. Uses `useRef` + `scrollIntoView` to auto-scroll to the latest message. Shows bouncing dots when loading.

**`ChatWindow.tsx`** — textarea input. Enter to send, Shift+Enter for new line. Disabled during loading.

**Note on `import type`:** Vite's `verbatimModuleSyntax` requires explicit `import type` for TypeScript types (not runtime values). Types live in `src/types.ts` and are imported with `import type { Message } from '../types'`.

---

### Step 11 — System Design prompt

`src/prompts/systemDesign.ts` — defines the interviewer's personality and rules:
- Forces phases: requirements → high-level → API contracts → data model → scalability → failure modes
- Rejects vague API descriptions — must have method, URL, request/response shapes, status codes
- Pushes back on "we'll use a cache" without specifics
- Keeps interviewer turns short (no hints, no teaching)

---

### Step 12 — System Design mode UI

`src/modes/SystemDesign.tsx`:
- `useEffect` with `[]` fires once on mount — auto-sends the first message to kick off the interview
- Header has a "New session" button that calls `reset()` — clears messages and session ID
- Layout: `flex flex-col h-full` — header fixed, ChatWindow flex-1, InputBar at bottom

---

## Build checklist

### Phase 1 — Backend ✅
- [x] Scaffold server with Node.js + Express + TypeScript
- [x] Set up Supabase + database schema (sessions, messages, challenges)
- [x] `/api/chat` route — streams Claude responses, saves to DB
- [x] `/api/sessions` routes — create, list, get with messages
- [x] `/api/challenges` routes — save, list, random, delete

### Phase 2 — Frontend core (in progress)
- [x] Update `useClaude.ts` to call server instead of Anthropic directly
- [x] Build shared components: ChatWindow, MessageBubble, InputBar
- [x] Write System Design prompt
- [x] Build System Design mode UI
- [ ] Build ModeSelector home screen + wire up App.tsx

### Phase 3 — More modes
- [ ] Coding Challenge mode
- [ ] Quiz / Flashcard mode

### Phase 4 — History & polish
- [ ] Session history page
- [ ] Offline challenge practice
- [ ] Design pass

---

*This file is updated as each step is completed.*
