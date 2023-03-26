import { all } from './items/combined.js'
import OrbsData from './orbsData.js'
import _ from 'lodash'
import UpgradeData from './upgradeData.js'

export default class AdventurerItem{

  _itemDef
  _data
  _baseItemId
  _advClass
  _level

  constructor(itemDef){
    if(_.isString(itemDef)){
      this._basicItem(itemDef)
    }else{
      this._craftedItem(itemDef)
    }
  }

  get level(){
    return this._level
  }

  get data(){
    return this._data
  }

  get displayName(){
    return this._data.displayName ?? ''
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

  /**
   * @returns {OrbsData}
   */
  get orbs(){
    return new OrbsData({ [this.advClass] : this._orbs.total(this.level) })
    // let baseOrbs
    // if(_.isObject(this.itemData.orbs)){
    //   baseOrbs = this.itemData.orbs
    // }else{
    //   baseOrbs = { [this.itemData.group]: this.itemData.orbs }
    // }
    // return new OrbsData([
    //   baseOrbs,
    //   ...this.applicableSlotEffects.map(slotEffect => slotEffect.orbs ?? {})
    // ])
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