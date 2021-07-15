import db from '../db.js'
import log from 'fancy-log'

const DEFAULTS = {
  name: '',
  username: '',
  experience: 0,
  level: 1,
  items: [1,0,0,0,0,0,0,0],
  date: new Date(0)
}

class Character {

  static async createNew(user, characterName){

    if(await load(characterName)){
      throw `Character with name ${characterName} already exists.`
    }

    const character = new Character(Object.assign({}, DEFAULTS, {
      name: characterName.toLowerCase(),
      username: user.name.toLowerCase(),
      date: new Date()
    }))

    await db.conn().collections('characters').insertOne(character.doc)
    log('Character created', character)
    return character
  }

}

async function load(name){
  return await db.conn().connection('characters')
    .findOne({
      name: name.toLowerCase()
    })
}

async function loadByUser(username){
  return await db.conn().connection('characters')
    .find({
      username: username.toLowerCase()
    })
    .sort({ date: 1 })
    .toArray()
}

async function create(user, characterName){
  await Character.createNew(user, characterName)
}

export default {
  loadByUser, create
}