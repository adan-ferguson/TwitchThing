import EffectInstance from './effectInstance.js'

export default class LoadoutObjectInstance extends EffectInstance{
  constructor({ obj, owner, state, slotInfo }){
    super(owner, state)
    this._obj = obj
    this._slotInfo = slotInfo
  }

  get effectId(){
    return this.effect.effectId ?? null
  }

  get data(){
    return this._obj.data ?? {}
  }

  get calculateBaseEffectData(){
    return this._obj.effect
  }

  get obj(){
    return this._obj
  }

  get name(){
    return this.obj.name
  }

  get displayName(){
    return this.obj.displayName
  }

  get slotInfo(){
    return this._slotInfo
  }

  get useCooldownMultiplier(){
    return true
  }

  get loadoutModifiers(){
    return this._obj.loadoutModifiers ?? []
  }
}