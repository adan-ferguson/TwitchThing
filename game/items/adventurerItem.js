import Items from './combined.js'
import _ from 'lodash'
import UpgradeData from '../upgradeData.js'
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

    const { data, level, baseItem } = expandDef(itemDef)

    super(data)

    this._def = itemDef
    this._level = level
    this._baseItem = baseItem
    this._orbs = new UpgradeData(baseItem.def.orbs ?? [0])
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

  get level(){
    return this._level
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
      [this.advClass]: this._orbs.total(this.level)
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
  if(_.isString(itemDef)){
    return basicItem(itemDef)
  }else{
    return craftedItem(itemDef)
  }
}

function basicItem(baseItemId){
  const baseItem = Items[baseItemId]
  if(!baseItem){
    throw 'Invalid baseItemId: ' + baseItemId
  }
  if(!baseItem.def.levelFn){
    throw 'Item is missing its levelFn: ' + baseItemId
  }

  return {
    data: baseItem.def.levelFn(1),
    level: 1,
    baseItem
  }
}

function craftedItem(itemDef){
  debugger
}