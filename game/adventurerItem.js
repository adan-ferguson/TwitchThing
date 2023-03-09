import Items from './items/combined.js'
import OrbsData from './orbsData.js'

export default class AdventurerItem{

  _itemDef
  _data

  constructor(itemDef){
    this._itemDef = itemDef
    if(Items[itemDef.group]?.[itemDef.name]){
      this._basicItem()
    }else if(itemDef._id){
      this._craftedItem()
    }
  }

  get isValid(){
    if(!this._data){
      return false
    }
    return this.displayName ? true : false
  }

  get displayName(){
    return this._data.displayName ?? ''
  }

  get effectData(){
    return this._data.effect ?? {}
  }

  get isBasic(){
    return this._itemDef.id ? false : true
  }

  get name(){
    return this._itemDef.name
  }

  get group(){
    return this._itemDef.group
  }

  get classes(){
    return [this.group] // this.orbs.classes
  }

  /**
   * @returns {OrbsData}
   */
  get orbs(){
    return new OrbsData({ [this.group] : this._data.orbs })
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
    return this.isBasic && adventurerItem.isBasic && this.name === adventurerItem.name
  }

  _basicItem(){
    const baseItem = Items[this._itemDef.group][this._itemDef.name]
    this._data = {
      ...baseItem,
      ...baseItem.levelFn(1)
    }
    delete this._data.levelFn
  }

  _craftedItem(){
    debugger
  }
}