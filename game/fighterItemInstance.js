import Stats from './stats/stats.js'
import { toDisplayName } from './utilFunctions.js'
import EffectInstance from './effectInstance.js'


export default class FighterItemInstance extends EffectInstance{

  constructor(itemData, state = {}, owner = null){
    super(state, owner)
    this._itemData = { ...itemData }
  }

  get id(){
    return this._itemData._id
  }

  get ability(){
    return this.itemData.ability
  }

  get mods(){
    return this.itemData.mods || []
  }

  get stats(){
    return new Stats(this.itemData.stats)
  }

  get displayName(){
    return this.itemData.displayName ?? toDisplayName(this.itemData.name)
  }

  get description(){
    return this.itemData.description ?? ''
  }

  get itemData(){
    return { ...this._itemData }
  }
}
