import Items from './items/combined.js'

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