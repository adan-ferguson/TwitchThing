const options = require('../config/config.json')
const packageOptions = require('../package.json')

const defaults = {
  port: 8080,
  db: {
    port: 27017,
    name: 'thing'
  },
  name: packageOptions.name,
  twitch: {
    clientID: null,
    clientSecret: null
  },
  // chatbot: {
  //   username: null,
  //   password: null
  // },
  secret: null,
  initialChannels: [],
  sslCertPassPhrase: null
}

if(!options.secret){
  throw 'config.json requires a "secret" value, this can just be any string.'
}

if(!options.sslCertPassPhrase){
  throw 'config.json requires a "sslCertPassPhrase" value, the pass phrase used to generate your ssl cert.'
}

if(!options.twitch.clientID){
  throw 'config.json requires  "twitch.clientID" value'
}

if(!options.twitch.clientSecret){
  throw 'config.json requires  "twitch.clientSecret" value'
}

// if(!options.chatbot.username){
//   throw 'config.json requires "twitch.username" value'
// }
//
// if(options.chatbot.password){
//   throw 'config.json requires "twitch.password" value'
// }

module.exports = Object.assign(defaults, options)