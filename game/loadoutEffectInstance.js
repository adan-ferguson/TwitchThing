import EffectInstance from './effectInstance.js'

export default class LoadoutEffectInstance extends EffectInstance{
  constructor({ obj, owner, state }){
    super(owner, state)
    this._obj = obj
  }

  get effectData(){
    return this._obj.effect ?? {}
  }
}