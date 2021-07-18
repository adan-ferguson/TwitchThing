import db from '../db.js'
import log from 'fancy-log'
import debounce from 'debounce'

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
      throw { name: `Character with name ${characterName} already exists.` }
    }

    const character = new Character(Object.assign({}, DEFAULTS, {
      name: characterName,
      username: user.username,
      date: new Date()
    }))

    await db.conn().collection('characters').insertOne(character.doc)
    log('Character created', character)
    return character
  }

  constructor(characterDocument) {
    // this.oldDoc = fixBackwardsCompatibility(userDocument)
    // this.doc = Object.assign({}, this.oldDoc)
    // this.save = debounce(this.save)}
    this.doc = Object.assign({}, characterDocument)
  }
}

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
  return await Character.createNew(user, characterName)
}