import EffectInstance from './effectInstance.js'
import { attackDamageStat, cooldownReductionStat } from './stats/combined.js'
import Stats from './stats/stats.js'

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

  get attackMultiplier(){
    // TODO: fn for stats of owner combined with slot effects
    const stats = new Stats(this.applicableSlotEffects.map(se => se.stats ?? {}))
    return stats.get(attackDamageStat).value
  }

  get cooldownReduction(){
    // TODO: fn for stats of owner combined with slot effects
    const stats = new Stats(this.applicableSlotEffects.map(se => se.stats ?? {}))
    return stats.get(cooldownReductionStat).value
  }
}
