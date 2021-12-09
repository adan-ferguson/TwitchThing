import express from 'express'
import db from '../db.js'
import * as Users from '../collections/users.js'
import * as Adventurers from '../collections/adventurers.js'

const router = express.Router()

router.post('/main', async(req, res) => {
  try {
    const payload = await Users.loadData(req.user, {
      adventurers: {
        name: 1,
        level: 1,
      }
    })
    res.send(payload)
  }catch(ex){
    return res.status(401).send(ex)
  }
})

router.post('/adventurer', async(req, res) => {
  try {
    const id = db.id(req.body.id)
    if(!id){
      return res.status(403).send('Invalid adventurer ID.')
    }
    const payload = await Adventurers.loadData(id, {
      name: 1,
      level: 1,
      xp: 1,
      loadout: 1
    })
    res.send(payload)
  }catch(ex){
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

export default router