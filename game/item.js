import Items from './items/combined.js'

export default class Item {
  constructor(data){
    this.data = Object.assign({
      baseItemID: null,
      name: null,
      username: null,
      date: new Date(),
      level: 1,
      tier: 1,
      bonuses: []
    }, data)
    if(!Items[this.data.baseItemID]){
      throw 'Invalid item ID: ' + this.data.baseItemID
    }
    if(!this.data.name){
      throw 'Missing item name.'
    }
    if(this.data.username){
      this.data.username = this.data.username.toLowerCase()
    }
    this.baseItem = Items[this.data.baseItemID]
  }

  scrapValue(){
    return 1 // TODO: calc
  }
}