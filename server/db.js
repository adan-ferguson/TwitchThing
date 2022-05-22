import MongoDB from 'mongodb'
import config from './config.js'
import log from 'fancy-log'

let connection
let client

const init = async () => {
  try {
    client = await MongoDB.MongoClient.connect(`mongodb://localhost:${config.db.port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    connection = client.db(config.db.name)
    log('Connected to DB')
  }catch(e){
    log('Failed to connect to DB, did you run "npm run startdb"?')
  }
}

const id = id => MongoDB.ObjectID(id)

const fix = (doc, defaults, projection = null) => {
  const fixedDoc = {}
  defaults = JSON.parse(JSON.stringify(defaults))
  for(let key in defaults){
    if(!projection || !Object.keys(projection).length || projection[key]){
      fixedDoc[key] = doc[key] ?? defaults[key]
    }
  }
  return fixedDoc
}

const qoid = queryOrID => {
  if(typeof(queryOrID) === 'string' || queryOrID instanceof MongoDB.ObjectID){
    queryOrID = { _id : id(queryOrID) }
  }
  return queryOrID
}

export default {
  init,
  client: () => client,
  conn: () => connection,
  id,
  save: async (doc, collectionName) => {
    if(doc._id){
      await connection.collection(collectionName).replaceOne({ _id: doc._id }, doc)
    }else{
      await connection.collection(collectionName).insertOne(doc)
    }
    return doc
  },
  fix,
  findOne: async (collection, queryOrID, projection = {}, defaults = {}) => {
    const doc = await connection.collection(collection).findOne(qoid(queryOrID), { projection })
    if(doc){
      return fix(doc, defaults, projection)
    }
    return null
  },
  find: async (collection, queryOrID, projection = {}, defaults = {}) => {
    const docs = await connection.collection(collection).find(qoid(queryOrID), { projection }).toArray()
    return docs.map(doc => fix(doc, defaults, projection))
  }
}