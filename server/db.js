const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient
const config = require('./config.js')
const log = require('fancy-log')

let connection

const init = async () => {
  try {
    let client = await MongoClient.connect(`mongodb://localhost:${config.db.port}`, { useNewUrlParser: true })
    connection = client.db(config.db.name)
    log('Connected to DB')
  }catch(e){
    log('Failed to connect to DB, did you run "npm run startdb"?')
  }
}

const id = id => MongoDB.ObjectID(id)

module.exports = {
  init,
  conn: () => connection,
  id
}