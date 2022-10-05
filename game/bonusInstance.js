import Bonuses from './bonuses/combined.js'
import Stats from './stats/stats.js'
import OrbsData from './orbsData.js'
import { toDisplayName } from './utilFunctions.js'
import EffectInstance from './effectInstance.js'

export default class BonusInstance extends EffectInstance{

  constructor({ group, name, level, owner = null, state = {} }){
    super(owner)
    this._bonusDef = Bonuses[group][name] ?? {
      name: '1st Level',
      group
    }
    this._level = level
    this._effectData = this._bonusDef.effect(level)
    this.setState(state)
  }

  get level(){
    return this._level
  }

  get id(){
    return this._bonusDef.name
  }

  get name(){
    return this._bonusDef.name
  }

  get group(){
    return this._bonusDef.group
  }

  get ability(){
    return this._effectData.ability
  }

  get mods(){
    return this._effectData.mods
  }

  get stats(){
    return new Stats(this._effectData.stats)
  }

  get displayName(){
    return toDisplayName(this.name)
  }

  get orbsData(){
    const orbs = {}
    orbs[this._bonusDef.group] = this.level
    // TODO: more complicated (+1 to others, +2 to self, etc)
    return new OrbsData(orbs)
  }

  get description(){
    return this._bonusDef.description || ''
  }
}
