import FighterSlotInstance from './fighterSlotInstance.js'

export default class MonsterItemInstance extends FighterSlotInstance{

  constructor(itemDef, state = null, owner = null){

    let itemData
    if(itemDef instanceof MonsterItemInstance){
      itemData = itemDef.itemData
      state = state ? state : itemDef.state
    }else{
      itemData = { ...itemDef }
    }

    super(itemData, state, owner)
  }
}