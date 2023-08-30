import MongoDB from 'mongodb'
import config from './config.js'
import { EventEmitter } from 'events'
import tunnel from 'tunnel-ssh'

let connection
let client

const events = new EventEmitter()

const init = async (forceSsh = false) => {
  try {
    let port
    if(config.db.ssh.enabled || forceSsh){
      const { tunnelOptions, serverOptions, sshOptions, forwardOptions } = config.db.ssh
      await tunnel.createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions)
      port = serverOptions.port
    }else{
      port = config.db.port
    }
    client = await MongoDB.MongoClient.connect(`mongodb://127.0.0.1:${port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    connection = client.db(config.db.name)
    events.emit('connected')
    console.log('Connected to DB')
  }catch(e){
    console.log('Failed to connect to DB, did you run "npm run startdb"?')
  }
}

const id = id => new MongoDB.ObjectId(id)

const fix = (doc, defaults, projection = {}) => {
  const fixedDoc = {} // _id: doc._id }
  projection = fullProjection(defaults, projection)
  defaults = JSON.parse(JSON.stringify(defaults))
  for(let key in defaults){
    if(projection[key]){
      fixedDoc[key] = doc[key] ?? defaults[key]
    }
  }
  return fixedDoc
}

const qoid = queryOrID => {
  if(typeof(queryOrID) === 'string' || queryOrID instanceof MongoDB.ObjectId){
    queryOrID = { _id : id(queryOrID) }
  }
  return queryOrID
}

export default {
  init,
  client: () => client,
  conn: () => connection,
  waitForConnection: () => {
    return new Promise((res) => {
      if(connection){
        res()
      }else{
        events.once('connected', res)
      }
    })
  },
  id,
  save: async (doc, collectionName) => {
    if(!doc._id){
      await connection.collection(collectionName).insertOne(doc)
    }else{
      await connection.collection(collectionName).replaceOne({ _id: doc._id }, doc)
    }
    return doc
  },
  saveMany: async(docs, collectionName) => {
    const operations = docs.map(doc => {
      if(!doc._id){
        return {
          insertOne: {
            document: doc
          }
        }
      }else{
        return {
          replaceOne: {
            filter: {
              _id: doc._id
            },
            replacement: doc
          }
        }
      }
    })
    const result = await connection.collection(collectionName).bulkWrite(operations)
    if(!result.ok){
      console.error(...result.writeErrors)
    }
  },
  fix,
  findOne: async (collection, { id = null, query = {}, projection = {}, defaults = {} }) => {
    const doc = await connection.collection(collection).findOne(qoid(id ?? query), { projection })
    if(doc){
      return fix(doc, defaults)
    }
    return null
  },
  find: async (collection, { id = null, query = {}, projection = {}, defaults = {}, sort = {}, limit = -1 }) => {
    let cursor = connection.collection(collection).find(qoid(id ?? query), { projection }).sort(sort)
    if(limit > 0){
      cursor = cursor.limit(limit)
    }
    const docs = await cursor.toArray()
    return docs.map(doc => fix(doc, defaults, projection))
  }
}

function fullProjection(defaults, projection){

  // If there's a projection with value > 1, then, everything else should be excluded.
  const exclusionary = Object.values(projection).find(val => val > 0)
  const fullProj = {}

  Object.keys(defaults).forEach(key => {
    fullProj[key] = exclusionary ? 0 : 1
  })

  fullProj._id = 1

  Object.keys(projection).forEach(key => {
    fullProj[key] = projection[key]
  })

  return fullProj
}