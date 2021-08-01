import db from '../db.js'
import log from 'fancy-log'
import { v4 as uuid } from 'uuid'

import { expToLevel, validateInventory } from '../../game/character.js'

const DEFAULTS = {
  name: '',
  username: '',
  experience: 0,
  items: [null,null,null,null,null,null,null,null],
  date: new Date(0)
}

class Character {

  constructor(doc){
    this.doc = Object.assign({}, DEFAULTS, doc)
    delete this.doc.level
  }

  get level(){
    return expToLevel(this.doc.experience)
  }

  async save(){
    const doc = this.toDoc()
    validateInventory(doc.level, doc.items)
    db.conn().collection('characters').replaceOne({ name: doc.name }, doc)
  }

  toDoc(){
    return Object.assign({ level: this.level }, this.doc)
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

  if(await load(characterName)){
    throw { name: `Character with name ${characterName} already exists.` }
  }

  const character = new Character({
    name: characterName,
    username: user.username,
    date: new Date()
  })

  character.doc.items[0] = {
    id: 'punch',
    uuid: uuid(),
    date: new Date()
  }

  const doc = character.toDoc()
  await db.conn().collection('characters').insertOne(doc)
  log('Character created', doc)
  return doc
}