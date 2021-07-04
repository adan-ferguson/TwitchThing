import React from 'react'
import { post } from './fizzetch'
import TwitchLoginLink from './components/twitchLoginLink'
import User from './user'

let userJson

export async function loadUser(){
  userJson = await post('/gettwitchuser', {
    accessToken: localStorage.getItem('accessToken')
  })
  return userJson.user ? new User(userJson.user) : false
}

export function createLoginLink(){
  return React.createElement(TwitchLoginLink, {
    loginLink: userJson.loginLink,
    stateID: userJson.stateID
  })
}