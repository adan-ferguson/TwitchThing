import Items from './combined.js'
import _ from 'lodash'
import AdventurerLoadoutObject from '../adventurerLoadoutObject.js'
import { toDisplayName, uniqueID } from '../utilFunctions.js'

export const ITEM_RARITIES = [
  {
    name: 'common',
    weight: 1,
    value: 5
  },
  {
    name: 'uncommon',
    weight: 0.5,
    value: 20
  },
  {
    name: 'rare',
    weight: 0.25,
    value: 50
  }
]

export default class AdventurerItem extends AdventurerLoadoutObject{

  _def
  _level
  _baseItem

  constructor(itemDef){
    super()
    const { level, baseItem } = expandDef(itemDef)
    this._def = itemDef
    this._level = level
    this._baseItem = baseItem
  }

  get calculateData(){
    return this._baseItem.def(this._level + this._levelAdjust)
  }

  get advClass(){
    return this._baseItem.group
  }

  get id(){
    return this._def.id ?? null
  }

  get name(){
    return this._baseItem.id
  }

  get baseItemId(){
    return this._baseItem.id
  }

  get classes(){
    return [this._baseItem.group]
  }

  get def(){
    return this._def
  }

  get baseDisplayName(){
    return this._def.displayName ?? this.data.displayName ?? toDisplayName(this._baseItem.id)
  }

  get displayName(){
    let txt = this.level > 1 ? `L${this.level} ` : ''
    return txt + this.baseDisplayName
  }

  get isBasic(){
    return this._def.id ? false : true
  }

  get orbs(){
    return {
      [this.advClass]: this.data.orbs
    }
  }

  get rarity(){
    return this._baseItem.rarity ?? 0
  }

  get rarityInfo(){
    return ITEM_RARITIES[this.rarity]
  }

  get scrapValue(){
    if(this.data.scrapValue){
      return this.data.scrapValue
    }
    const scrapVal = this.rarityInfo.value
    return scrapVal * (1 + this.level * (this.level - 1) / 2)
  }

  get tags(){
    return this.effect.tags ?? []
  }

  sameItem(adventurerItem){
    return this.isBasic && adventurerItem.isBasic && this.def === adventurerItem.def
  }

  upgradeInfo(){

    if(this.level === this.data.maxLevel){
      return {}
    }

    const upgradedItemDef = {
      id: uniqueID(),
      ...(_.isString(this.def) ? {} : this.def),
      baseItem: this.baseItemId,
      level: this.level + 1
    }

    const upgradedItem = new AdventurerItem(upgradedItemDef)

    const components = []
    components.push({ type: 'scrap', count: 2 * (upgradedItem.scrapValue - this.scrapValue) })
    components.push({ type: 'item', baseItemId: this.baseItemId, advClass: this.advClass, count: Math.max(2, this.level) })

    return { upgradedItemDef, components }
  }

  equals(otherAdventurerItem){
    if(otherAdventurerItem instanceof AdventurerItem){
      if(this.isBasic){
        if(otherAdventurerItem.isBasic && this.baseItemId === otherAdventurerItem.baseItemId){
          return true
        }
      }else if(this.id === otherAdventurerItem.id){
        return true
      }
    }
    return false
  }
}

function expandDef(itemDef){
  let level
  let baseItemId
  if(_.isString(itemDef)){
    level = 1
    baseItemId = itemDef
  }else{
    level = itemDef.level
    baseItemId = itemDef.baseItem
  }
  const baseItem = Items[baseItemId]
  if(!baseItem){
    throw 'Invalid baseItemId: ' + baseItemId
  }
  return {
    level,
    baseItem
  }
}