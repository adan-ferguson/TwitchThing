import express from 'express'
import Users from '../../collections/users.js'
import {
  getUserWorkshop,
  scrapItems,
  upgradeAdventurerItem,
  upgradeInventoryItem
} from '../../workshop/workshop.js'
import { validateParam } from '../../validations.js'

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.user.features.workshop){
    throw { status: 400, message: 'Workshop is not unlocked yet.' }
  }
  next()
})

router.post('/scrapyard', async(req, res, next) => {
  res.send({ data: await getUserWorkshop(req.user) })
})

router.post('/scrapyard/scrap', async(req, res, next) => {
  await scrapItems(req.user, validateParam(req.body.scrappedItems))
  res.send({
    success: 1
  })
})

router.post('/forge', async(req, res, next) => {
  res.send({ data: await getUserWorkshop(req.user), firstTime: req.user.features.workshop === 1 })
  if(req.user.features.workshop === 1){
    req.user.features.workshop = 2
    Users.save(req.user)
  }
})

router.post('/forge/upgrade', async(req, res, next) => {
  const def = req.body.itemDef
  let upgradedItemDef
  if(def){
    upgradedItemDef = await upgradeInventoryItem(req.user, req.body.itemDef)
  }else{
    upgradedItemDef = await upgradeAdventurerItem(
      req.user,
      validateParam(req.body.itemSlot),
      validateParam(req.body.adventurerID, 'string')
    )
  }
  res.send({
    upgradedItemDef
  })
})

export default router