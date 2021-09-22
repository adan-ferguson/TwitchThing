import db from '../db.js'
import log from 'fancy-log'
import Item from './items.js'

import { expToLevel, validateInventory } from '../../game/character.js'

const DEFAULTS = {
  name: '',
  username: '',
  experience: 0,
  items: [null,null,null,null,null,null,null,null],
  innateBonuses: [],
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

export async function create(user, charactername){

  if(await load(charactername)){
    throw { name: `Character with name ${charactername} already exists.` }
  }

  const item = new Item({
    username: user.username,
    charactername: charactername,
    baseItemID: 'Sword',
    name: 'Sword'
  })

  const character = new Character({
    name: charactername,
    username: user.username,
    date: new Date(),
    items: [item.data._id, null, null, null, null, null, null, null]
  })

  const doc = character.toDoc()
  await db.conn().collection('characters').insertOne(doc)

  log('Character created', doc)
  return doc
}