import express from 'express'
import { getAllActiveRuns, getRunData } from '../dungeons/dungeonRunner.js'
import db from '../db.js'
import Combats from '../collections/combats.js'

const router = express.Router()

router.get('/dungeonrun/:dungeonRunID', async (req, res) => {
  res.render('game', {
    startupParams: {
      watch: {
        page: 'dungeonrun',
        id: req.params.dungeonRunID
      }
    }
  })
})

router.get('/combat/:combatID', async(req, res, body) => {
  res.render('game', {
    startupParams: {
      watch: {
        page: 'combat',
        id: req.params.combatID
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
  const combat = await Combats.findOne(db.id(req.params.combatID))
  if(!combat){
    return res.status(404).send('Combat not found.')
  }
  const currentTime = Date.now()
  const state = combat.startTime + combat.duration < currentTime ? { status: 'finished', currentTime: combat.endTime } : { status: 'live', currentTime }
  res.send({ combat, state })
})

router.post('/livedungeonmap', async(req, res) => {
  const activeRuns = getAllActiveRuns(true)
  res.send({
    activeRuns
  })
})

export default router