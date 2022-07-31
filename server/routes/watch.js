import express from 'express'
import { getRunData } from '../dungeons/dungeonRunner.js'
import db from '../db.js'
import Adventurers from '../collections/adventurers.js'
import Combats from '../collections/combats.js'

const router = express.Router()

router.get('/dungeonrun/:dungeonRunID', async (req, res) => {
  const dungeonRun = await getRunData(db.id(req.params.dungeonRunID))
  if(!dungeonRun){
    res.redirect('/')
  }
  res.render('game', {
    startupParams: {
      watch: {
        page: 'dungeonrun',
        id: dungeonRun._id
      }
    }
  })
})

router.post('/dungeonrun/:dungeonRunID', async (req, res) => {
  const dungeonRun = await getRunData(db.id(req.params.dungeonRunID))
  if(!dungeonRun){
    return res.status(400).send({ error: 'Dungeon Run not found' })
  }
  res.send({
    dungeonRun
  })
})

router.post('/combat/:combatID', async(req, res) => {
  try {
    const combat = await Combats.findOne(db.id(req.params.combatID))
    if(!combat){
      return res.status(404).send('Combat not found.')
    }
    const currentTime = Date.now()
    const state = combat.startTime + combat.duration < currentTime ? { status: 'finished' } : { status: 'live', currentTime }
    res.send({ combat, state })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

export default router