import EffectInstance from './effectInstance.js'

export default class LoadoutObjectInstance extends EffectInstance{
  constructor({ obj, owner, state, slotInfo }){
    super(obj.effect, owner, state)
    this._obj = obj
    this._slotInfo = slotInfo
  }

  get obj(){
    return this._obj
  }

  get displayName(){
    return this.obj.displayName
  }

  get slotInfo(){
    return this._slotInfo
  }
}