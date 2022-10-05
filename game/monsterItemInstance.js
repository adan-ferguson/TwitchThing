import { uuid } from './utilFunctions.js'
import FighterItemInstance from './fighterItemInstance.js'

export default class MonsterItemInstance extends FighterItemInstance{

  constructor(itemDef, state = null, owner = null){

    let itemData
    if(itemDef instanceof MonsterItemInstance){
      itemData = itemDef.itemData
      state = state ? state : itemDef.state
    }else{
      itemData = { ...itemDef }
    }

    super(itemData, state, owner)

    this._id = uuid()
  }

  get id(){
    return this._id
  }
}