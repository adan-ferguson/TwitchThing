import db from '../db.js'
import { emit } from '../socketServer.js'

const PROJECTION_CATEGORIES = {
  mainpage: {
    adventurers: {
      name: 1,
      level: 1,
    }
  }
}

// emit(eventName, data){
//   log(this.username, eventName, data)
//   emit(this.username, eventName, data)
// }

export async function load(magicID){
  return await db.conn().collection('users').findOne({
    magicID
  }) || null
}

export async function loadData(_userid, category){
  const projection = PROJECTION_CATEGORIES[category]
  if(!projection){
    throw 'Invalid category: ' + category
  }
  return await db.conn().collection('users').findOne({ _id: _userid }, projection)
}

export async function create(magicID, iat, email){
  const userDoc = { magicID, iat, auth: { type: 'email', email } }
  await db.conn().collection('users').insertOne(userDoc)
  return userDoc
}

export async function save(userDoc){
  if(userDoc._id){
    await db.conn().collection('users').replaceOne({ _id: userDoc._id }, userDoc)
  }else{
    await db.conn().collection('users').insertOne(userDoc)
  }
}

export async function login(userDoc, iat){
  if(userDoc.iat >= iat){
    throw `Replay attack detected for user ${userDoc.magicID}.`
  }
  userDoc.iat = iat
  save(userDoc)
}
//
export async function loadGameData(userDoc){
  return {
    displayname: userDoc.displayname,
    // resources: this.doc.resources,
    // characters: await Characters.loadByUser(this.username),
    // inventory: await Items.loadByUser(this.username)
  }
}

export async function setDisplayname(userDoc, displayname){
  displayname = displayname + ''
  if(displayname.length <= 1){
    return 'Display name must be between 2 and 15 letters.'
  }
  if(displayname.length > 15){
    return 'Display name must be between 2 and 15 letters.'
  }
  const user = await db.conn().collection('users').findOne({ displayname })
  if(user){
    return `Display name '${displayname}' is taken.`
  }
  userDoc.displayname = displayname
  await save(userDoc)
}

export function isSetupComplete(userDoc){
  return userDoc.displayname ? true : false
}