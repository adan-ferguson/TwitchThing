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
  magic: {
    publishableKey: null,
    secretKey: null
  },
  secret: null,
  requireHttps: true,
  serverURL: null
}

if(!options.secret){
  throw 'config.js requires a "secret" value, this can just be any string.'
}

if(!options.twitch.clientID){
  throw 'config.js requires "twitch.clientID" value'
}

if(!options.serverURL){
  throw 'config.js requires "serverURL" value'
}

if(!options.twitch.clientSecret){
  throw 'config.js requires "twitch.clientSecret" value'
}

if(!options.magic.publishableKey){
  throw 'config.js requires "magic.publishableKey" value'
}

if(!options.magic.secretKey){
  throw 'config.js requires "magic.secretKey" value'
}

export default Object.assign(defaults, options)