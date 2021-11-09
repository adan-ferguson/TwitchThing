import Items from './items/combined.js'
import { v4 as uuid } from 'uuid'

export default class Item {
  constructor(data){
    this.data = Object.assign({
      uuid: uuid(),
      baseItemID: null,
      baseCost: 1,
      name: null,
      username: null,
      charactername: null,
      date: new Date(),
      tier: 1,
      bonuses: []
    }, data)
    if(!Items[this.data.baseItemName]){
      throw 'Invalid item ID: ' + this.data.baseItemName
    }
    if(!this.data.name){
      throw 'Missing item name.'
    }
    if(this.data.username){
      this.data.username = this.data.username.toLowerCase()
    }
    this.baseItem = Items[this.data.baseItemName]
  }

  scrapValue(){
    return 1 // TODO: calc
  }
}