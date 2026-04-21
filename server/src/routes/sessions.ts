import { Router, Request, Response } from 'express'
import { supabase } from '../services/supabase'

const router = Router()

// Create a new session
router.post('/', async (req: Request, res: Response) => {
  const { mode, topic } = req.body

  if (!mode) {
    res.status(400).json({ error: 'mode is required' })
    return
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({ mode, topic })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

// Get all sessions (for history page)
router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, messages(count)')
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

// Get a single session with all its messages
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('sessions')
    .select('*, messages(*)')
    .eq('id', id)
    .order('created_at', { ascending: true, referencedTable: 'messages' })
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

// Delete a session and all its messages
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  // Delete messages first in case the FK doesn't cascade
  const { error: msgError } = await supabase
    .from('messages')
    .delete()
    .eq('session_id', id)

  if (msgError) {
    res.status(500).json({ error: msgError.message })
    return
  }

  const { error: sessionError } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)

  if (sessionError) {
    res.status(500).json({ error: sessionError.message })
    return
  }

  res.status(204).send()
})

// Save a user message to a session
router.post('/:id/messages', async (req: Request, res: Response) => {
  const { id } = req.params
  const { role, content } = req.body

  if (!role || !content) {
    res.status(400).json({ error: 'role and content are required' })
    return
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ session_id: id, role, content })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

export default router
