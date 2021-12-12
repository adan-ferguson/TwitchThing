import express from 'express'
import * as Users from '../../collections/users.js'
import * as Adventurers from '../../collections/adventurers.js'

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
    return res.status(ex.code || 401).send(ex.error || ex)
  }
})

export default router