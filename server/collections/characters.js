import db from '../db.js'
import log from 'fancy-log'
import { initDocument } from '../../game/character.js'

export async function load(name){
  return await db.conn().collection('characters')
    .findOne({
      name: name.toLowerCase()
    })
}

export async function loadByUser(username){
  return await db.conn().collection('characters')
    .find({
      username: username.toLowerCase()
    })
    .sort({ date: 1 })
    .toArray()
}

export async function create(user, characterName){

  if(await load(characterName)){
    throw { name: `Character with name ${characterName} already exists.` }
  }

  const doc = initDocument({
    name: characterName,
    username: user.username,
    date: new Date()
  })

  await db.conn().collection('characters').insertOne(doc)
  log('Character created', doc)
  return doc
}