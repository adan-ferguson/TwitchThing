import Items from './items/combined.js'
import { toDisplayName } from './utilFunctions.js'
import Stats from './stats/stats.js'

export default class ItemInstance{
  constructor(itemDef){
    this.itemDef = itemDef.itemDef ?? itemDef
    this.baseItem = Items[this.itemDef.baseType.group][this.itemDef.baseType.name]
  }
  get id(){
    return this.itemDef.id
  }
  get displayName(){
    return this.itemDef.displayName || this.baseItem.displayName || toDisplayName(this.baseItem.name)
  }
  get stats(){
    return new Stats(this.baseItem.stats)
  }
  get orbs(){
    return { [this.baseItem.group]: this.baseItem.orbs }
  }
  get mods(){
    return this.baseItem.mods || []
  }
  get description(){
    return this.baseItem.description || ''
  }
}