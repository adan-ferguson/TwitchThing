import express from 'express'
import Adventurers from '../../collections/adventurers.js'
import DungeonRuns from '../../collections/dungeonRuns.js'
import { addRun } from '../../dungeons/dungeonRunner.js'
import { finalizeResults } from '../../dungeons/results.js'
import db  from '../../db.js'
import Users from '../../collections/users.js'
import { commitAdventurerLoadout } from '../../loadouts/adventurer.js'
import asyncHandler from 'express-async-handler'
import createError from 'http-errors'

const router = express.Router()
const verifiedRouter = express.Router()

router.use('/:adventurerID', asyncHandler(async (req, res, next) => {
  const adventurerID = db.id(req.params.adventurerID)
  if(!req.user.adventurers.find(adv => adv.equals(adventurerID))){
    throw createError(400, 'Invalid adventurer ID')
  }
  req.adventurer = await Adventurers.findOne(adventurerID)
  if(!req.adventurer){
    throw createError(400, 'Invalid adventurer ID')
  }
  next()
}))

// TODO is this really the only way to do this
router.use('/:adventurerID', verifiedRouter)

verifiedRouter.post('/dungeonpicker', validatePage('idle'), async(req, res) => {
  res.send({ adventurer: req.adventurer })
})

verifiedRouter.post('/enterdungeon', validatePage('idle'), async(req, res) => {
  req.validateParam('dungeonOptions', {
    type: {
      zone: true
    }
  })
  res.send({ dungeonRun: addRun(req.adventurerID, req.body.dungeonOptions) })
})

verifiedRouter.post('/dungeonrun', validatePage('dungeon'), async(req, res) => {
  res.send({ adventurer: req.adventurer, dungeonRun: req.dungeonRun })
})

verifiedRouter.post('/results', validatePage('finished'), async (req, res) => {
  res.send({ adventurer: req.adventurer, dungeonRun: req.dungeonRun })
})

verifiedRouter.post('/confirmresults', validatePage('finished'), async (req, res) => {
  req.validateParam('selectedBonuses')
  await finalizeResults(req.user, req.adventurer, req.body.selectedBonuses)
  res.status(200).send({ result: 'okay' })
})

verifiedRouter.post('/editloadout', validatePage('idle'), async (req, res) => {
  const user = await Users.gameData(req.user)
  if(user.features.items === 1){
    Users.update(user._id, { ['features.items']: 2 })
  }
  res.status(200).send({ adventurer: req.adventurer, items: user.inventory.items })
})

verifiedRouter.post('/editloadout/save', validatePage('idle'), async (req, res) => {
  const items = req.validateParam('items', { type: 'array' })
  await commitAdventurerLoadout(req.adventurer, req.user, items)
  await Adventurers.save(req.adventurer)
  await Users.save(req.user)
  res.status(200).end()
})

verifiedRouter.post('', validatePage('idle'), async(req, res, next) => {
  const ctas = {}
  if(req.user.features.items === 1){
    ctas.itemFeature = true
  }
  res.send({ adventurer: req.adventurer, ctas })
})

/**
 * Throw exception with "targetPage" value if the target page doesn't match the adventurer state.
 * Otherwise, return the loaded adventurer.
 * @param requiredPage {'idle'|'results'|'dungeon'}
 */
function validatePage(requiredPage){
  return asyncHandler(async (req, res, next) => {
    let correctPage = 'idle'
    if (req.adventurer.dungeonRunID){
      const run = await DungeonRuns.findOne(req.adventurer.dungeonRunID)
      req.dungeonRun = run
      correctPage = run.finished ? 'results' : 'dungeon'
    }
    if (requiredPage !== correctPage){
      // res.redirect something something
      res.status(400).send({ targetPage: correctPage })
    }else{
      next()
    }
  })
}

export default router