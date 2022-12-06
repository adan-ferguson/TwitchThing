import express from 'express'
import Users from '../../collections/users.js'
import { getUserWorkshop } from '../../workshop/workshop.js'

const router = express.Router()

router.use(async (req, res, next) => {
  if(!req.user.features.workshop){
    throw { status: 400, message: 'Workshop is not unlocked yet.' }
  }
  next()
})

router.post('/', async (req, res, next) => {
  res.send({ data: await getUserWorkshop(req.user), firstTime: req.user.features.workshop === 1 })
  if(req.user.features.workshop === 1){
    req.user.features.workshop = 2
    Users.save(req.user)
  }
})

export default router