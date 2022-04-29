import express from 'express'
import Adventurers from '../../collections/adventurers.js'
import { addRun, getRunData } from '../../dungeons/dungeonRunner.js'
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

router.use('/:adventurerID', verifiedRouter)

verifiedRouter.post('/dungeonpicker', validatePage('adventurer'), async(req, res) => {
  res.send({ adventurer: req.adventurer })
})

verifiedRouter.post('/enterdungeon', validatePage('adventurer'), async(req, res) => {
  const startingFloor = req.validateParam('startingFloor')
  const dungeonRun = addRun(req.adventurer._id, {
    startingFloor
  })
  res.send({ dungeonRun })
})

verifiedRouter.post('/dungeonrun', validatePage('dungeon'), async(req, res) => {
  res.send({
    adventurer: req.adventurer,
    dungeonRun: await getRunData(req.adventurer.dungeonRunID)
  })
})

verifiedRouter.post('/results', validatePage('dungeon'), async (req, res) => {
  res.send({
    adventurer: req.adventurer,
    dungeonRun: await getRunData(req.adventurer.dungeonRunID)
  })
})

verifiedRouter.post('/confirmresults', validatePage('dungeon'), async (req, res) => {
  req.validateParam('selectedBonuses')
  await finalizeResults(req.user, req.adventurer, req.body.selectedBonuses)
  res.status(200).send({ result: 'okay' })
})

verifiedRouter.post('/editloadout', validatePage('adventurer'), async (req, res) => {
  const user = await Users.gameData(req.user)
  if(user.features.items === 1){
    Users.update(user._id, { ['features.items']: 2 })
  }
  res.status(200).send({ adventurer: req.adventurer, items: user.inventory.items })
})

verifiedRouter.post('/editloadout/save', validatePage('adventurer'), async (req, res) => {
  const items = req.validateParam('items', { type: 'array' })
  await commitAdventurerLoadout(req.adventurer, req.user, items)
  await Adventurers.save(req.adventurer)
  await Users.save(req.user)
  res.status(200).end()
})

verifiedRouter.post('/status', async(req, res, next) => {
  res.send({ status: req.adventurer.dungeonRunID ? 'dungeon' : 'idle' })
})

verifiedRouter.post('', validatePage('adventurer'), async(req, res, next) => {
  const ctas = {}
  if(req.user.features.items === 1){
    ctas.itemFeature = true
  }
  res.send({ adventurer: req.adventurer, ctas })
})

/**
 * Throw exception with "targetPage" value if the target page doesn't match the adventurer state.
 * Otherwise, return the loaded adventurer.
 * @param requiredPage {'adventurer'|'results'|'dungeon'}
 */
function validatePage(requiredPage){
  return asyncHandler(async (req, res, next) => {
    const correctPage = req.adventurer.dungeonRunID ? 'dungeon' : 'adventurer'
    if (requiredPage !== correctPage){
      // res.redirect something something
      res.status(400).send({ targetPage: { name: correctPage, args: [req.adventurer._id] } })
    }else{
      next()
    }
  })
}

export default router