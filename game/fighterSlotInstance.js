import EffectInstance from './effectInstance.js'

export default class FighterSlotInstance extends EffectInstance{

  constructor(effectData, state = {}, owner = null){
    super(owner, state)
    this._effectData = effectData
  }

  get calculateBaseEffectData(){
    return this._effectData
  }

  get slot(){
    if(!this.owner){
      return -1
    }
    return this.owner.itemInstances.indexOf(this)
  }

  get slotTags(){
    return []
  }

  get isBasic(){
    return true
  }

  get activeAbility(){
    return this.getAbility('active')
  }

  get applicableSlotEffects(){
    return this.owner?.getSlotEffectsFor(this.slot) ?? []
  }
}
