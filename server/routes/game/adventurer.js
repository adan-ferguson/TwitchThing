import express from 'express'
import Adventurers from '../../collections/adventurers.js'
import { addRun } from '../../dungeons/dungeonRunner.js'
import db  from '../../db.js'
import Users from '../../collections/users.js'
import { commitAdventurerLoadout } from '../../loadouts/adventurer.js'
import { requireRegisteredUser, validateParam } from '../../validations.js'
import { selectBonus } from '../../adventurer/bonuses.js'
import DungeonRuns from '../../collections/dungeonRuns.js'

const router = express.Router()
const verifiedRouter = express.Router()

router.post('/new', async(req, res) => {
  const startingClass = validateParam(req.body.class, {
    required: false
  }) ?? 'fighter'
  const name = validateParam(req.body.name)
  const adventurer = await Users.newAdventurer(req.user, name, startingClass)
  res.send({ adventurerID: adventurer._id })
})

router.use('/:adventurerID', async (req, res, next) => {
  const adventurerID = db.id(req.params.adventurerID)
  req.adventurer = await Adventurers.findByID(adventurerID)
  if(!req.adventurer){
    throw { code: 400, message: 'Invalid adventurer ID' }
  }
  next()
})

router.use('/:adventurerID', verifiedRouter)

verifiedRouter.post('/dungeonpicker', validateIdle, async(req, res) => {
  res.send({ adventurer: req.adventurer })
})

verifiedRouter.post('/enterdungeon', validateIdle, async(req, res) => {
  requireOwnsAdventurer(req)
  const startingFloor = validateParam(req.body.startingFloor, { type: 'integer', required: false }) || 1
  const pace = validateParam(req.body.pace, { type: 'string', required: false })
  const dungeonRun = await addRun(req.adventurer._id, {
    startingFloor,
    pace
  })
  res.send({ dungeonRun })
  if(req.user.features.dungeonPicker === 1){
    req.user.features.dungeonPicker = 2
    Users.save(req.user)
  }
})

verifiedRouter.post('/editloadout', validateIdle, async (req, res) => {
  const user = await Users.gameData(req.user)
  res.status(200).send({
    adventurer: req.adventurer,
    items: user.inventory.items
  })

  // Clear the accomplishment
  let updated = false
  if(user.features.editLoadout === 1){
    updated = true
    req.user.features.editLoadout = 2
  }
  Object.values(req.user.inventory.items).forEach(item => {
    if(item.isNew){
      item.isNew = false
      updated = true
    }
  })
  if(updated){
    Users.save(req.user)
  }
})

verifiedRouter.post('/editloadout/save', validateIdle, async (req, res) => {
  requireOwnsAdventurer(req)
  const items = validateParam(req.body.items, { type: 'array' })
  await commitAdventurerLoadout(req.adventurer, req.user, items)
  await Adventurers.save(req.adventurer)
  await Users.save(req.user)
  res.status(200).send({ success: 1 })
})

verifiedRouter.post(['', '/levelup'], async(req, res, next) => {
  res.send({ adventurer: req.adventurer, user: req.user })
})

verifiedRouter.post('/dismiss', async(req, res, next) => {
  const index = req.user.adventurers.findIndex(advID => advID.equals(req.adventurer._id))
  if(index === -1){
    throw 'Adventurer can not be dismissed, not in user\'s adventurer list'
  }
  req.user.adventurers.splice(index, 1)
  req.adventurer.items.forEach(i => {
    if(!i){
      return
    }
    req.user.inventory.items[i.id] = i
  })
  await Users.save(req.user)
  res.status(200).send({ success: 1 })
})

verifiedRouter.post('/status', async(req, res, next) => {
  res.send({ status: req.adventurer.dungeonRunID ? 'dungeon' : 'idle' })
})

verifiedRouter.post('/selectbonus/:index', async(req, res, next) => {
  requireOwnsAdventurer(req)
  const index = validateParam(req.params.index, {
    type: 'integer',
    validationFn: val => val >= 0 && val <= 2
  })
  res.send({ nextLevelUp: await selectBonus(req.adventurer, index) })
})

verifiedRouter.post('/previousruns', async(req, res, next) => {
  const runs = await DungeonRuns.find({
    query: {
      'adventurer._id': req.adventurer._id,
      finalized: { $ne: null }
    },
    projection: {
      events: 0
    }
  })
  res.send({ adventurer: req.adventurer, runs: runs.reverse()  })
})

async function validateIdle(req, res, next){
  if(req.adventurer.dungeonRunID){
    throw {
      status: 400,
      message: 'Adventurer is in a dungeon run and can not perform this action.'
    }
  }
  next()
}

export function requireOwnsAdventurer(req){
  requireRegisteredUser(req)
  if(!req.user.adventurers.find(adv => adv.equals(req.adventurer._id))){
    throw { code: 400, message: 'Invalid adventurer ID' }
  }
}

export default router