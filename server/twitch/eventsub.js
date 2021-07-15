import fetch from 'node-fetch'
import config from '../config.js'

async function subscribeToEvents(channel){

  // try {
  //   let resp = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions',{
  //     method: 'post',
  //     headers: {
  //       Authorization: 'Bearer ' + token,
  //       'client-id': config.twitch.clientID,
  //       'Content-Type': 'application/json'
  //     },
  //     body: {
  //
  //     }
  //   })
  //   const result = await resp.json()
  //
  // } catch(e) {
  //   return null
  // }
}

export default {
  subscribeToEvents
}