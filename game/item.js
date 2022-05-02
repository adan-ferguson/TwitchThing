import Items from './items/combined.js'
import Stats from './stats/stats.js'
import { toDisplayName } from './utilFunctions.js'

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

  get HTML(){
    const stats = this.baseType.stats
    let html = '<div>'
    for(let key in stats){
      html += `<div>${key}: ${stats[key]}</div>`
    }
    html += '</div>'
    return html
  }

  get baseType(){
    return Items[this.itemDef.baseType]
  }

  get id(){
    return this.itemDef.id
  }

  get name(){
    return this.itemDef.displayName || this.baseType.displayName || toDisplayName(this.baseType.name)
  }

  get orbs(){
    return this.baseType.orbs
  }

  get stats(){
    return new Stats(this.baseType.stats)
  }
}