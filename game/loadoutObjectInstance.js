import EffectInstance from './effectInstance.js'
import { toDisplayName } from './utilFunctions.js'

export default class LoadoutObjectInstance extends EffectInstance{
  constructor({ obj, owner, state }){
    super(owner, state)
    this._obj = obj
  }

  get obj(){
    return this._obj
  }

  get effectData(){
    return this._obj.effect ?? {}
  }

  get displayName(){
    return this.obj.displayName
  }
}