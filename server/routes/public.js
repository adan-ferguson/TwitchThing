import express from 'express'
import * as Users  from '../collections/users.js'
import config from '../config.js'

const router = express.Router()

router.get('/login', (req, res) => {
  if(req.user){
    res.redirect('/game')
  }else{
    res.render('login', {
      magicPublishableKey: config.magic.publishableKey
    })
  }
})

router.get('/newuser', (req, res) => {
  if(!req.user){
    res.redirect('/login')
  }else if(req.user.displayname){
    res.redirect('/game')
  }else{
    if(req.query && req.query.displayname){
      const err = Users.setDisplayname(req.user, req.query.displayname)
      if(err){
        res.render('newuser', { error: err })
      }else{
        res.redirect('/game')
      }
    }else{
      res.render('newuser')
    }
  }
})

router.get('/', (req, res) => {
  if(!req.session.username){
    res.redirect('/login')
  }else{
    res.redirect('/game')
  }
})

export default router