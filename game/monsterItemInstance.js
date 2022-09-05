import FighterItemInstance from './fighterItemInstance.js'
import Items from './items/combined.js'

export default class MonsterItemInstance extends FighterItemInstance{

  constructor(itemDef, state = null){

    let itemData
    if(itemDef instanceof MonsterItemInstance){
      itemData = itemDef.itemData
      state = state ? state : itemDef.state
    }else{
      const baseItem = Items[itemDef.baseType.group][itemDef.baseType.name] ?? {}
      itemData = {
        ...baseItem
      }
    }

    super(itemData, state)
  }
}