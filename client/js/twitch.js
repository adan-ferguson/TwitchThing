import React from 'react'
import { post } from './fizzetch'
import TwitchLoginLink from './components/twitchLoginLink'

let userJson

export async function loadUser(){
  const response = await post('/gettwitchuser', {
    accessToken: localStorage.getItem('accessToken')
  })
  userJson = await response.json()
  return userJson.user || false
}

export function createLoginLink(){
  return React.createElement(TwitchLoginLink, {
    loginLink: userJson.loginLink,
    stateID: userJson.stateID
  })
}