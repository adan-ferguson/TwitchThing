import express from 'express'
import { buyShopItem, getUserShop } from '../../shop/shop.js'
import Users from '../../collections/users.js'
import { validateParam } from '../../validations.js'

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.user.features.shop){
    throw { status: 400, message: 'Shop is not unlocked yet.' }
  }
  next()
})

router.post('/', async (req, res, next) => {
  res.send({ shopItems: await getUserShop(req.user), firstTime: req.user.features.shop === 1 })
  if(req.user.features.shop === 1){
    req.user.features.shop = 2
    Users.save(req.user)
  }
})

router.post('/buy', async(req, res, next) => {
  const itemId = validateParam(req.body.id)
  const result = await buyShopItem(req.user, itemId)
  res.send(result)
})

export default router