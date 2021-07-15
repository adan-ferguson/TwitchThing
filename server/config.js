import options from '../config.js'

const defaults = {
  port: 8080,
  db: {
    port: 27017,
    name: 'thing'
  },
  twitch: {
    clientID: null,
    clientSecret: null
  },
  // chatbot: {
  //   username: null,
  //   password: null
  // },
  secret: null,
  requireHttps: true
}

if(!options.secret){
  throw 'config.js requires a "secret" value, this can just be any string.'
}

if(!options.twitch.clientID){
  throw 'config.js requires  "twitch.clientID" value'
}

if(!options.serverURL){
  throw 'config.js requires  "serverURL" value'
}

if(!options.twitch.clientSecret){
  throw 'config.js requires  "twitch.clientSecret" value'
}

// if(!options.chatbot.username){
//   throw 'config.js requires "twitch.username" value'
// }
//
// if(options.chatbot.password){
//   throw 'config.js requires "twitch.password" value'
// }

export default Object.assign(defaults, options)