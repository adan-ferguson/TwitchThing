import express from 'express'

import adventurerRouter from './adventurer.js'
import dungeonRunRouter from './dungeonrun.js'

import Adventurers from '../../collections/adventurers.js'
import { getAllActiveRuns, getRunData } from '../../dungeons/dungeonRunner.js'
import { requireRegisteredUser } from '../../validations.js'

const router = express.Router()

router.use('/adventurer', adventurerRouter)
router.use('/dungeonrun', dungeonRunRouter)

router.post('/', async(req, res) => {
  requireRegisteredUser(req)
  const adventurers = await Adventurers.findByIDs(req.user.adventurers)
  for(let adv of adventurers){
    if(adv.dungeonRunID){
      adv.dungeonRun = await getRunData(adv.dungeonRunID)
    }
  }
  res.send({ adventurers })
})

router.post('/livedungeonmap', async(req, res) => {
  const activeRuns = getAllActiveRuns(true)
  res.send({
    activeRuns
  })
})

router.get(new RegExp('.*'), async(req, res) => {
  res.render('game')
})

export default router