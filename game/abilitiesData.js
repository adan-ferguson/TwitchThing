import AbilityInstance from './abilityInstance.js'

export default class AbilitiesData{

  _owner
  instances

  constructor(abilities, states, parentEffect){
    this._owner = parentEffect
    this.instances = {}
    for(let key in abilities){
      this.instances[key] = new AbilityInstance(abilities[key], states[key], parentEffect)
    }
  }

  get stateVal(){
    const val = {}
    for(let key in this.instances){
      val[key] = this.instances[key].state
    }
    return val
  }

  set stateVal(vals){
    for(let key in vals){
      this.instances[key].state = vals[key]
    }
  }

  advanceTime(ms){
    for(let key in this.instances){
      this.instances[key].advanceTime(ms)
    }
    return this
  }

  refreshCooldowns(def = null){
    const pct = def ? def.amountPct : 1
    const flat = def ? def.amountFlat : 0
    for(let key in this.instances){
      this.instances[key].cooldownRemaining -= flat
      this.instances[key].cooldownRemaining *= (1 - pct)
    }
  }
}