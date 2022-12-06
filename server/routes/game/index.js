import express from 'express'

import adventurerRouter from './adventurer.js'
import dungeonRunRouter from './dungeonrun.js'
import shopRouter from './shop.js'
import workshopRouter from './workshop.js'

import Adventurers from '../../collections/adventurers.js'
import { getAllActiveRuns, getRunData } from '../../dungeons/dungeonRunner.js'
import { requireRegisteredUser } from '../../validations.js'
import adminRouter from './admin.js'
import Combats from '../../collections/combats.js'

const router = express.Router()

router.use('/adventurer', adventurerRouter)
router.use('/dungeonrun', dungeonRunRouter)
router.use('/admin', adminRouter)
router.use('/shop', shopRouter)
router.use('/workshop', workshopRouter)

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

router.post('/combat/:combatID', async(req, res) => {
  const combat = await Combats.findByID(req.params.combatID)
  if(!combat){
    return res.status(404).send('Combat not found.')
  }
  res.send({ combat })
})

router.get(new RegExp('.*'), async(req, res) => {
  res.render('game')
})

export default router