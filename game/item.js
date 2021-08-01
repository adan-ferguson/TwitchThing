import Items from './items/combined.js'

export default class Item {
  constructor({ id, uuid, date }){
    if(!Items[id]){
      throw 'Invalid item ID: ' + id
    }
    if(!uuid){
      throw 'Missing uuid'
    }
    this.itemDefinition = Items[id]
    this.uuid = uuid
    this.date = date
  }
}