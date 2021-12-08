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
  }
}