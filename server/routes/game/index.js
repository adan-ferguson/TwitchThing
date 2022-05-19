import express from 'express'
import Users from '../../collections/users.js'

import adventurerRouter from './adventurer.js'
import dungeonRunRouter from './dungeonrun.js'

import Adventurers from '../../collections/adventurers.js'
import { getActiveRunData } from '../../dungeons/dungeonRunner.js'
import { validateParam } from '../../validations.js'

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.user){
    throw { code: 401, message: 'Not logged in', redirect: '/' }
  }
  if(!Users.isSetupComplete(req.user)){
    throw { code: 401, message: 'User setup not complete', redirect: '/user/newuser' }
  }
  next()
})

router.use('/adventurer', adventurerRouter)
router.use('/dungeonrun', dungeonRunRouter)

router.post('/main', async(req, res) => {
  const adventurers = await Adventurers.findByIDs(req.user.adventurers)
  adventurers.forEach(adv => adv.dungeonRun = getActiveRunData(adv.dungeonRunID))
  res.send({  adventurers, slots: req.user.inventory.adventurerSlots })
})

router.post('/newadventurer', async(req, res) => {
  try {
    const adventurer = await Users.newAdventurer(req.user, validateParam(req.body.name))
    res.send({ adventurerID: adventurer._id })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

router.get('/', async(req, res) => {
  res.render('game')
})

export default router