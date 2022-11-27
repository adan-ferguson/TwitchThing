import express from 'express'
import { getUserShop } from '../../shop/shop.js'
import Users from '../../collections/users.js'

const router = express.Router()

router.post('/', async (req, res, next) => {
  if(!req.user.features.shop){
    throw { status: 400, message: 'Shop is not unlocked yet.' }
  }
  res.send({ shopItems: await getUserShop(req.user), firstTime: req.user.features.shop === 1 })
  if(req.user.features.shop === 1){
    req.user.features.shop = 2
    Users.save(req.user)
  }
})

export default router