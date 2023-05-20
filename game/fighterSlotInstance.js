import EffectInstance from './effectInstance.js'

export default class FighterSlotInstance extends EffectInstance{

  constructor(baseEffectData, state = {}, owner = null){
    super(baseEffectData, owner, state)
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
