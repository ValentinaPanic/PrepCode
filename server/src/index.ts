import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat'
import sessionsRouter from './routes/sessions'
import challengesRouter from './routes/challenges'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Health check — lets you confirm the server is running
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api/chat', chatRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/challenges', challengesRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
