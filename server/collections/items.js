import Item from '../../game/item.js'
import db from '../db.js'

export async function create(data){
  const item = new Item(data)
  await db.conn().collection('items').insertOne(item.data)
  return item
}

export async function createStartingItem(characterName){
  return await create({
    owner: characterName,
    baseItemID: 'Sword',
    name: 'Sword'
  })
}

export async function loadByUser(username){
  return await db.conn().collection('items')
    .find({
      username: username.toLowerCase()
    })
    .sort({ date: 1 })
    .toArray()
}