import Items from './items/combined.js'
import Stats from './stats/stats.js'

export default class Item{
  constructor(itemDef){
    if(itemDef instanceof Item){
      itemDef = itemDef.itemDef
    }
    if(!itemDef.baseType){
      throw `Invalid itemDef, invalid baseType ${itemDef.baseType}.`
    }
    this.itemDef = itemDef
  }

  get baseType(){
    return Items[this.itemDef.baseType]
  }

  get id(){
    return this.itemDef.id
  }

  get name(){
    return this.itemDef.name
  }

  get orbs(){
    return this.baseType.orbs
  }

  get stats(){
    return new Stats(this.baseType.stats)
  }
}