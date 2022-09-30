import Bonuses from './bonuses/combined.js'
import Stats from './stats/stats.js'
import OrbsData from './orbsData.js'
import { toDisplayName } from './utilFunctions.js'
import EffectInstance from './effectInstance.js'

export default class BonusInstance extends EffectInstance{

  constructor({ group, name }){
    super()
    this.bonusDef = Bonuses[group][name] ?? {
      name: '1st Level',
      group
    }
  }

  get id(){
    return this.name
  }

  get group(){
    return this.bonusDef.group
  }

  get name(){
    return this.bonusDef.name
  }

  get displayName(){
    return toDisplayName(this.name)
  }

  get orbsData(){
    const orbs = {}
    orbs[this.bonusDef.group] = this.bonusDef.orbs || 1
    return new OrbsData(orbs)
  }

  get stats(){
    return new Stats(this.bonusDef.stats)
  }

  get mods(){
    return this.bonusDef.mods || []
  }

  get description(){
    return this.bonusDef.description || ''
  }
}
