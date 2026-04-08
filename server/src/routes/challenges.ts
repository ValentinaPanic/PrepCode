import { Router, Request, Response } from 'express'
import { supabase } from '../services/supabase'

const router = Router()

// Save a generated challenge for later offline use
router.post('/', async (req: Request, res: Response) => {
  const { mode, topic, difficulty, content } = req.body

  if (!mode || !content) {
    res.status(400).json({ error: 'mode and content are required' })
    return
  }

  const { data, error } = await supabase
    .from('challenges')
    .insert({ mode, topic, difficulty, content })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

// Get all saved challenges — optionally filter by mode or difficulty
router.get('/', async (req: Request, res: Response) => {
  const { mode, difficulty } = req.query

  let query = supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })

  if (mode) query = query.eq('mode', mode)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data, error } = await query

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

// Get a single random challenge — for offline practice
router.get('/random', async (req: Request, res: Response) => {
  const { mode, difficulty } = req.query

  let query = supabase
    .from('challenges')
    .select('*')

  if (mode) query = query.eq('mode', mode)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data, error } = await query

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  if (!data || data.length === 0) {
    res.status(404).json({ error: 'No challenges found' })
    return
  }

  const random = data[Math.floor(Math.random() * data.length)]
  res.json(random)
})

// Delete a challenge
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const { error } = await supabase
    .from('challenges')
    .delete()
    .eq('id', id)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(204).send()
})

export default router
