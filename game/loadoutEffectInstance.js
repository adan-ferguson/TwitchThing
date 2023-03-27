import EffectInstance from './effectInstance.js'

export default class LoadoutEffectInstance extends EffectInstance{
  constructor({ obj, owner, slotIndex, state }){
    super(owner, state)
    this._obj = obj
  }

  get effectData(){
    return this._obj.data.effect ?? {}
  }
}