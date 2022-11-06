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
    const match = this.effectId.match(/item-(\d)/)
    return match ? parseInt(match[1]) : -1
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
