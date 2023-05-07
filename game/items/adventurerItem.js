import Items from './combined.js'
import _ from 'lodash'
import UpgradeData from '../upgradeData.js'
import AdventurerLoadoutObject from '../adventurerLoadoutObject.js'
import { toDisplayName } from '../utilFunctions.js'

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

  sameItem(adventurerItem){
    return this.isBasic && adventurerItem.isBasic && this.def === adventurerItem.def
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