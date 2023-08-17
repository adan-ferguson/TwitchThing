import options from '../config.js'

const defaults = {
  port: 8080,
  db: {
    port: 27017,
    name: 'thing'
  },
  magic: {
    publishableKey: null,
    secretKey: null
  },
  verboseLogs: false,
  secret: null,
  requireHttps: true,
}

if(!options.secret){
  throw 'config.js requires a "secret" value, this can just be any string.'
}

if(!options.magic.publishableKey){
  throw 'config.js requires "magic.publishableKey" value'
}

if(!options.magic.secretKey){
  throw 'config.js requires "magic.secretKey" value'
}

export default Object.assign(defaults, options)