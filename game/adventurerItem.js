import { all } from './items/combined.js'
import OrbsData from './orbsData.js'
import _ from 'lodash'
import UpgradeData from './upgradeData.js'
import AdventurerLoadoutObject from './adventurerLoadoutObject.js'

export default class AdventurerItem extends AdventurerLoadoutObject{

  _def
  _baseItemId
  _advClass
  _level

  constructor(itemDef){
    super()
    if(_.isString(itemDef)){
      this._basicItem(itemDef)
    }else{
      this._craftedItem(itemDef)
    }
    this._def = itemDef
  }

  get def(){
    return this._def
  }

  get level(){
    return this._level
  }

  get displayName(){
    let txt = this.level > 1 ? `L${this.level} ` : ''
    return txt + this._data.displayName
  }

  get isBasic(){
    return true // this._itemDef.id ? false : true
  }

  get advClass(){
    return this._advClass
  }

  get baseItemId(){
    return this._baseItemId
  }

  get orbs(){
    return {
      [this.advClass]: this._orbs.total(this.level)
    }
  }

  sameItem(adventurerItem){
    return this.isBasic && adventurerItem.isBasic && this.baseItemId === adventurerItem.baseItemId
  }

  _basicItem(baseItemId){
    const baseItem = all[baseItemId]
    if(!baseItem){
      throw 'Invalid baseItemId: ' + baseItemId
    }
    if(!baseItem.levelFn){
      throw 'Item is missing its levelFn: ' + baseItemId
    }
    this._baseItemId = baseItemId
    this._advClass = baseItem.group
    this._level = 1
    this._data = baseItem.levelFn(1)
    this._orbs = new UpgradeData(baseItem.orbs ?? [0])
  }

  _craftedItem(){
    debugger
  }
}