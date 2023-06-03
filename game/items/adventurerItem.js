import Items from './combined.js'
import _ from 'lodash'
import AdventurerLoadoutObject from '../adventurerLoadoutObject.js'
import { toDisplayName } from '../utilFunctions.js'

export const ITEM_RARITIES = [
  {
    name: 'common',
    weight: 90,
    value: 3
  },
  {
    name: 'uncommon',
    weight: 30,
    value: 8
  },
  {
    name: 'rare',
    weight: 10,
    value: 19
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
    return this._baseItem.id
  }

  get name(){
    return this.id
  }

  get classes(){
    return [this._baseItem.group]
  }

  get def(){
    return this._def
  }

  get displayName(){
    let txt = this.level > 1 ? `L${this.level} ` : ''
    return txt + (this.data.displayName ?? toDisplayName(this._baseItem.id))
  }

  get isBasic(){
    return true // this._itemDef.id ? false : true
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
    const scrapVal = this.rarityInfo.value
    return scrapVal * (1 + this.level * (this.level - 1) / 2)
  }

  sameItem(adventurerItem){
    return this.isBasic && adventurerItem.isBasic && this.def === adventurerItem.def
  }

  withModifiedLevel(levelAdjust){
    return this
    // let ai
    // if(_.isString(this.def)){
    //   if(level === 1){
    //     ai = new AdventurerItem(this.def)
    //   }
    //   ai = new AdventurerItem({ baseItem: this.def, level })
    // }else{
    //   ai = new AdventurerItem({ ...this.def, level })
    // }
    // ai.unmodifiedLevel = this.level
    // return ai
  }

  upgradeInfo(){
    // TODO: this
    // const upgradedItemDef = {
    //   id: uniqueID(),
    //   ...this.itemDef,
    //   level: this.level + 1
    // }
    //
    // const upgradedItem = new AdventurerItem(upgradedItemDef)
    //
    // const components = []
    // components.push({ type: 'scrap', count: upgradedItem.scrapValue - this.scrapValue })
    //
    // if(this.level > 1){
    //   components.push({ type: 'item', group: this.itemDef.group, name: this.itemDef.name, count: this.level - 1 })
    // }
    //
    // return { upgradedItemDef, components }
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