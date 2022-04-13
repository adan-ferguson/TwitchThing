import express from 'express'
import Users from '../collections/users.js'
import { generateItem } from '../items/generator.js'

const router = express.Router()

// Make sure we're logged in + we're an admin
router.use(async (req, res, next) => {
  if(!Users.isAdmin(req.user)){
    if(req.method === 'GET'){
      return res.redirect('/')
    }else{
      return res.status(401).send({ error: 'Unauthorized' })
    }
  }
  next()
})

router.post('/', async(req, res) => {
  res.status(200).send({})
})

router.post('/runcommand', async(req, res) => {
  req.validateParam('command')
  const cmd = req.body.command
  let result = 'Command not found'
  if(cmd === 'reset items'){
    const users = await Users.find({})
    Promise.all(users.map(async user => {
      user.items = [
        generateItem('SWORD'),
        generateItem('PLATEMAIL'),
        generateItem('BOOTS')
      ]
      await Users.save(user)
    }))
    result = 'User items all reset.'
  }
  res.status(200).send({ result })
})

export default router