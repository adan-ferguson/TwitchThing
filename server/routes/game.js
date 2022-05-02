import express from 'express'
import Users from '../collections/users.js'

import adventurerRouter from './game/adventurer.js'
import Adventurers from '../collections/adventurers.js'
import { levelToAdventurerSlots } from '../../game/user.js'
import { getRunDataMulti } from '../dungeons/dungeonRunner.js'

const router = express.Router()

// Make sure we're logged in.
router.use(async (req, res, next) => {
  if(!req.user){
    if(req.method === 'GET'){
      return res.redirect('/')
    }else{
      return res.status(401).send('Not logged in')
    }
  }
  next()
})

// Make sure we're allowed to play, and if not then redirect somewhere.
router.use((req, res, next) => {
  let redirect = ''
  if(!Users.isSetupComplete(req.user)){
    redirect = '/user/newuser'
  }
  if(redirect){
    if(req.method === 'GET'){
      return res.redirect(redirect)
    }else{
      return res.status(401).send('Not logged in')
    }
  }
  next()
})

router.use('/adventurer', adventurerRouter)

router.post('/main', async(req, res) => {
  try {
    const adventurers = await Adventurers.findByIDs(req.user.adventurers)
    const dungeonRuns = await getRunDataMulti(adventurers.map(adv => adv.dungeonRunID).filter(id => id))
    res.send({  adventurers, dungeonRuns, slots: levelToAdventurerSlots(req.user.level) })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

router.post('/newadventurer', async(req, res) => {
  try {
    req.validateParam('name')
    const adventurer = await Users.newAdventurer(req.user, req.body.name)
    res.send({ adventurerID: adventurer._id })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

router.get('/', async(req, res) => {
  res.render('game')
})

export default router