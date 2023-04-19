import Items from './items/combined.js'
import _ from 'lodash'
import UpgradeData from './upgradeData.js'
import AdventurerLoadoutObject from './adventurerLoadoutObject.js'

export default class AdventurerItem extends AdventurerLoadoutObject{

  _def
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

  get orbs(){
    return {
      [this.advClass]: this._orbs.total(this.level)
    }
  }

  sameItem(adventurerItem){
    return this.isBasic && adventurerItem.isBasic && this.def === adventurerItem.def
  }

  _basicItem(baseItemId){
    const baseItem = Items[baseItemId]
    if(!baseItem){
      throw 'Invalid baseItemId: ' + baseItemId
    }
    if(!baseItem.def.levelFn){
      throw 'Item is missing its levelFn: ' + baseItemId
    }
    this._baseItemId = baseItemId

    this._level = 1
    this._data = baseItem.def.levelFn(1)
    this._orbs = new UpgradeData(baseItem.def.orbs ?? [0])
  }

  _craftedItem(){
    debugger
  }
}