const fetch = require('node-fetch')
const config = require('./config.js')
const { v4: guid } = require('uuid')

const twitch = {
  getUserInfo: async (accessToken) => {
    try {
      let resp = await fetch('https://api.twitch.tv/helix/users',{
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'client-id': config.twitch.clientID,
          'Content-Type': 'application/json'
        }
      })
      const result = await resp.json()
      if(!result.data || !result.data.length){
        return null
      }
      return result.data[0]
    } catch(e) {
      return null
    }
  },
  getLoginLink: req => {
    let stateID = guid()
    let obj = {
      client_id: config.twitch.clientID,
      redirect_uri: `${req.protocol}://${req.headers.host}/twitchredirect`,
      response_type: 'token',
      scope: '',
      state: stateID
    }
    return  {
      loginLink: 'https://id.twitch.tv/oauth2/authorize' + jsonToQueryString(obj),
      stateID: stateID
    }
  }
}

function jsonToQueryString(json) {
  return '?' +
    Object.keys(json).map(function(key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key])
    }).join('&')
}

module.exports = twitch