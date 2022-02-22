import express from 'express'
import * as Adventurers from '../../collections/adventurers.js'
import * as DungeonRuns from '../../collections/dungeonRuns.js'
import db from '../../db.js'
import * as Ventures from '../../dungeons/ventures.js'
import { finalizeVenture } from '../../dungeons/ventures.js'
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
    const venture =  Ventures.beginVenture(req.user._id, req.adventurerID, req.params.dungeonID)
    res.send({ venture })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/dungeonrun', async(req, res) => {
  try {
    const adventurer = await Adventurers.findOne(req.adventurerID)
    if(!adventurer.dungeonRunID){
      return res.status(404).send({ error: 'Adventurer is not currently in a dungeon run.' })
    }
    const dungeonRun = await DungeonRuns.findOne({
      _id: adventurer.dungeonRunID,
      adventurerID: req.adventurerID
    }, {
      adventurerID: 1,
      dungeonID: 1,
      floor: 1,
      room: 1,
      finished: 1,
      currentEvent: 1,
      rewards: 1
    })
    if(!dungeonRun){
      return res.status(500).send({ error: 'Could not load dungeon run.' })
    }
    res.send({ adventurer, dungeonRun })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/results', async (req, res) => {
  try {
    const adventurer = await Adventurers.findOne(req.adventurerID)
    if(!adventurer.dungeonRunID){
      return res.status(401).send({ error: 'Adventurer is not currently in a dungeon run.', targetPage: 'Adventurer' })
    }
    const dungeonRun = await DungeonRuns.findOne(adventurer.dungeonRunID)
    if(!dungeonRun || !dungeonRun.finished){
      return res.status(401).send({ error: 'Dungeon run is not finished yet.', targetPage: 'Dungeon' })
    }
    res.send({
      adventurer,
      dungeonRun
    })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('/confirmresults', async (req, res) => {
  try {
    await finalizeVenture(req.adventurerID, req.body.selectedBonuses)
    res.status(200).send({ result: 'okay' })
  }catch(error){
    return res.status(error.code || 500).send({ error: error.message || error })
  }
})

verifiedRouter.post('', async(req, res, next) => {
  try {
    const adventurer = await Adventurers.findOne(req.adventurerID)
    res.send({ adventurer })
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

export default router