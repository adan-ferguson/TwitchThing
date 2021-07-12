const fetch = require('node-fetch')
const config = require('../config.js')

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

module.exports = {
  subscribeToEvents
}