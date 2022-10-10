import Bonuses from './bonuses/combined.js'
import OrbsData from './orbsData.js'
import EffectInstance from './effectInstance.js'

export default class BonusInstance extends EffectInstance{

  constructor(bonusDef, owner = null, state = {}){
    super(owner, state)
    this._bonusDef = bonusDef
  }

  get effectData(){
    const bonusDef = Bonuses[this._bonusDef.group][this._bonusDef.name]
    return {
      ...bonusDef.effect(this._bonusDef.level),
      name: this._bonusDef.name,
      description: bonusDef.description
    }
  }

  get level(){
    return this._bonusDef.level
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

  get orbsData(){
    const orbs = {}
    orbs[this._bonusDef.group] = this.level
    return new OrbsData(orbs)
  }
}
