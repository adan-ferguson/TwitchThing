import EffectInstance from './effectInstance.js'

export default class FighterItemInstance extends EffectInstance{

  constructor(itemData, state = {}, owner = null){
    super(owner, state)
    this.itemData = itemData
  }

  get effectData(){
    return this.itemData
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

  get activeAbility(){
    return this.getAbility('active')
  }

  get applicableSlotEffects(){
    return this.owner?.getSlotEffectsFor(this.slot) ?? []
  }
}
