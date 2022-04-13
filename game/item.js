import Items from './items/combined.js'

export default class Item{
  constructor(itemDef){
    if(!this.baseType){
      throw `Invalid itemDef, invalid baseType ${this.baseType}.`
    }
    this.itemDef = itemDef
  }

  get baseType(){
    return Items[this.itemDef.baseType]
  }

  get id(){
    return this.itemDef.id
  }

  get stats(){
    return this.baseType.stats
  }
}