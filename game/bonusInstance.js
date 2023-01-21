import Bonuses from './bonuses/combined.js'
import OrbsData from './orbsData.js'
import EffectInstance from './effectInstance.js'
import _ from 'lodash'

export default class BonusInstance extends EffectInstance{

  constructor(bonusDef, owner = null, state = {}){
    super(owner, state)
    this._bonusDef = bonusDef
  }

  get baseDef(){
    return Bonuses[this._bonusDef.group][this._bonusDef.name]
  }

  get effectData(){
    const effect = this.baseDef.effect
    const data = _.isFunction(effect) ? effect(this._bonusDef.level) : effect
    return {
      ...data,
      name: this._bonusDef.name
    }
  }

  get level(){
    return this._bonusDef.level
  }

  get effectId(){
    return 'bonus-' + this._bonusDef.name
  }

  get name(){
    return this._bonusDef.name
  }

  get group(){
    return this._bonusDef.group
  }

  get orbsData(){
    const orbs = {}
    orbs[this._bonusDef.group] = this.level
    return new OrbsData(orbs)
  }

  get upgradable(){
    return _.isFunction(this.baseDef.effect)
  }

  get slotEffect(){
    return this.effectData.slotEffect ?? null
  }

  get slotBonus(){
    return this.baseDef.slotBonus ?? null
  }
}
