import { parseDescriptionString } from './descriptionString.js'
import { silencedMod } from '../../game/mods/combined.js'

export const AbilityState = {
  NONE: 'none',
  DISABLED: 'disabled',
  READY: 'ready',
  RECHARGING: 'recharging'
}

export default class AbilityDisplayInfo{
  constructor(effectInstance){
    this._abilities = effectInstance.abilities
    this._owner = effectInstance.owner
  }

  get noAbility(){
    return !this.mainAbility
  }

  get mainAbility(){
    const active = this._abilities.active
    if(active){
      return { type: 'active', instance: active }
    }
    const type = Object.keys(this._abilities)[0]
    if(!type){
      return null
    }
    return { type, instance: this._abilities[type] }
  }

  get type(){
    if(this.noAbility){
      return 'none'
    }
    return this.mainAbility.type === 'active' ? 'active' : 'triggered'
  }

  get descriptionEl(){
    if(this.mainAbility.instance.description){
      return parseDescriptionString(this.mainAbility.instance.description, this._owner)
    }
    return null
    // Derived descriptions
    // TODO: add the trigger
    // return this.mainAbility.instance.actions.map(action => {
    // if(action.type === 'attack'){
    //   return attackDescription(action, this._owner)
    // }
    // if(action.type === 'gainHealth'){
    //   return gainHealthDescription(action, this._owner)
    // }
    // if(action.type === 'effect'){
    //   return effectAction(action, this._owner)
    // }
    // if(action.type === 'time'){
    //   return timeAction(action.ms)
    // }
    // }).join(' ')
  }

  get state(){
    if(!this.mainAbility){
      return AbilityState.NONE
    }else if(this._owner.mods.contains(silencedMod)){
      return AbilityState.DISABLED
    }else if(this.mainAbility.instance.ready){
      return AbilityState.READY
    }else if(this.mainAbility.instance.enabled){
      return AbilityState.RECHARGING
    }
    return AbilityState.DISABLED
  }

  get barPct(){
    if(!this.mainAbility || this.state === AbilityState.DISABLED){
      return 0
    }
    if(this.mainAbility.instance.cooldown){
      return 1 - this.mainAbility.instance.cooldownRemaining / this.mainAbility.instance.cooldown
    }else if(this.mainAbility.instance.uses){
      return 1 - this.mainAbility.instance.timesUsed / this.mainAbility.instance.uses
    }
    return 0
  }
}