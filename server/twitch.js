const fetch = require('node-fetch')
const config = require('./config.js')
const users = require('./db_models/user')
const { v4: guid } = require('uuid')

const twitch = {
  getUsernameFromAccessToken: async (token) => {
    try {
      let resp = await fetch({
        method: 'get',
        url: 'https://api.twitch.tv/helix/users',
        headers: {
          Authorization: 'Bearer ' + token,
          'client-id': config.twitch.clientID
        },
        json: true
      })
      if(resp.data.length > 0){
        return resp.data[0].login
      }
      return null
    } catch(e) {
      return null
    }
  },
  getLoginLink: (req, stateID) => {

    let obj = {
      client_id: config.twitch.clientID,
      redirect_uri: `${req.protocol}://${req.headers.host}/twitchredirect`,
      response_type: 'token id_token',
      scope: 'openid',
      state: stateID
    }

    return 'https://id.twitch.tv/oauth2/authorize' + jsonToQueryString(obj)
  },
  getTwitchInfo: req => {
    let id = guid()
    return  {
      username: req.session.username || null,
      loginLink: twitch.getLoginLink(req, id),
      stateID: id
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