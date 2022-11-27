import express from 'express'
import { getUserShop } from '../../shop/shop.js'

const router = express.Router()
const verifiedRouter = express.Router()

verifiedRouter.post('/', async (req, res, next) => {
  res.send({ shopItems: await getUserShop(req.user) })
})

export default router