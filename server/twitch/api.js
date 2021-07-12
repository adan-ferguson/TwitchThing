const fetch = require('node-fetch')
const config = require('../config.js')
const { v4: guid } = require('uuid')
const log = require('fancy-log')

let appAccessToken = null

const ADVANCED_SCOPES = ['channel:read:redemptions']

async function getUserInfo(accessToken){
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
}

function getLoginLink(req){
  return generateLink(`${req.headers.origin}/loginredirect`)
}

function getChannelAuthLink(req){
  return generateLink(`${req.headers.origin}/channelauthredirect`, ADVANCED_SCOPES.join(' '))
}

function generateLink(redirect_uri, scope = ''){
  let stateID = guid()
  let obj = {
    client_id: config.twitch.clientID,
    redirect_uri,
    response_type: 'token',
    scope,
    state: stateID
  }
  return  {
    loginLink: 'https://id.twitch.tv/oauth2/authorize?' + jsonToQueryString(obj),
    stateID: stateID
  }
}

/**
 * @param usernames {[string]}
 * @returns {Promise<*[]|*>}
 */
async function getOnlineStreams(usernames){

  if(usernames.length > 100){
    let statuses = []
    for(let i = 0; i < usernames.length; i += 100){
      statuses.concat(await getOnlineStreams(usernames.slice(i, i + 100)))
    }
    return statuses
  }

  let qs = ''
  usernames.forEach(username => {
    qs += `user_login=${username}&`
  })
  qs = qs.substring(0, qs.length - 1) // Remove final &

  try {
    let results = await fetch('https://api.twitch.tv/helix/streams?' + qs, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + await getAppAccessToken(),
        'client-id': config.twitch.clientID,
        'Content-Type': 'application/json'
      }
    })
    let json = await results.json()
    return json.data.map(result => result.user_name.toLowerCase() )
  } catch(e) {
    log('Could not get user statuses: ', e)
    if(e.status === 401){
      appAccessToken = null
    }
    return []
  }
}

async function getAppAccessToken(){

  if(appAccessToken){
    return appAccessToken
  }

  try {
    appAccessToken = await requestNewAppAccessToken()
  }catch(e) {
    log('Could not get app access token: ', e)
  }

  return appAccessToken

  async function requestNewAppAccessToken(){

    const url = 'https://id.twitch.tv/oauth2/token?' + jsonToQueryString({
      client_id: config.twitch.clientID,
      client_secret: config.twitch.clientSecret,
      grant_type: 'client_credentials'
    })

    let resp = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let json = await resp.json()
    return json.access_token
  }
}

async function validateAccessToken(accessToken, username, advanced = false){
  const url = 'https://id.twitch.tv/oauth2/validate'
  const resp = await fetch(url, {
    method: 'get',
    headers: {
      Authorization: 'OAuth ' + accessToken,
      'Content-Type': 'application/json'
    }
  })
  const json = await resp.json()
  if(!json || json.login !== username){
    return false
  }
  if(advanced){
    const invalidScope = ADVANCED_SCOPES.find(scope => {
      return json.scopes.indexOf(scope) === -1
    })
    if(invalidScope){
      return false
    }
  }
  return true
}

function jsonToQueryString(json) {
  return Object.keys(json).map(function(key) {
    return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key])
  }).join('&')
}

module.exports = {
  getLoginLink,
  getChannelAuthLink,
  getUserInfo,
  getOnlineStreams,
  validateAccessToken
}