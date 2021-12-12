import express from 'express'
import * as Adventurers from '../../collections/adventurers.js'
import db from '../../db.js'
import * as Ventures from '../../dungeons/ventures.js'
const router = express.Router()
const verifiedRouter = express.Router()

router.use('/:adventurerID', function(req, res, next){
  req.adventurerID = db.id(req.params.adventurerID)
  if(!req.user.adventurers.find(adv => adv.equals(req.adventurerID))){
    return res.status(401).send('Not logged in')
  }
  next()
})

// TODO is this really the only way to do this
router.use('/:adventurerID', verifiedRouter)

verifiedRouter.post('/dungeonpicker', async(req, res) => {
  try {
    res.send({ dungeons: ['these do not exist yet lol'] })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

verifiedRouter.post('/enterdungeon/:dungeonID', async(req, res) => {
  try {
    const venture =  Ventures.beginVenture(req.adventurerID, req.params.dungeonID)
    res.send({ venture })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('*', async(req, res, next) => {
  try {
    const adventurer = await Adventurers.loadData(req.adventurerID, {
      name: 1,
      level: 1,
      xp: 1,
      loadout: 1
    })
    res.send({ adventurer })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

export default router