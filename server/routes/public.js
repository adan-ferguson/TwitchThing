import express from 'express'
import config from '../config.js'
import { getAllActiveRuns, getRunData } from '../dungeons/dungeonRunner.js'
import db from '../db.js'
import Combats from '../collections/combats.js'

const router = express.Router()

router.get('/oauthredirect', (req, res) => {
  res.render('oauthredirect', {
    magicPublishableKey: config.magic.publishableKey
  })
})

router.get('/login', (req, res) => {
  if(req.user){
    res.redirect('/game')
  }else{
    res.render('login', {
      magicPublishableKey: config.magic.publishableKey
    })
  }
})

router.get('/', (req, res) => {
  if(!req.user){
    res.redirect('/login')
  }else{
    res.redirect('/game')
  }
})

/**************************************/

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
  const combat = await Combats.findByID(req.params.combatID)
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