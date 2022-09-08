import Items from './items/combined.js'
import FighterItemInstance from './fighterItemInstance.js'

export default class AdventurerItemInstance extends FighterItemInstance{

  constructor(itemDef, state = null){

    let itemData
    if(itemDef instanceof AdventurerItemInstance){
      itemData = itemDef.itemData
      state = state ? state : itemDef.state
    }else{
      const baseItem = Items[itemDef.baseType.group][itemDef.baseType.name] ?? {}
      itemData = {
        ...baseItem
      }
    }

    super(itemData, state)
    this._itemDef = itemDef
  }

  get itemDef(){
    return this._itemDef
  }

  get id(){
    return this._itemDef.id
  }

  get activeAbility(){
    return this.itemData.active
  }

  get orbs(){
    return { [this.itemData.group]: this.itemData.orbs }
  }
}