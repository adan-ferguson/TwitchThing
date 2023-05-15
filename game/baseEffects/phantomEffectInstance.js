import EffectInstance from '../effectInstance.js'
import { phantom as PhantomEffects } from './combined.js'
import _ from 'lodash'

export default class PhantomEffectInstance extends EffectInstance{

  constructor(data, owner, parentEffect = null){
    super(owner)
    this._data = data
    this._parentEffect = parentEffect
  }

  get uniqueID(){
    return this._parentEffect.uniqueID
  }

  get data(){
    return this._data
  }

  get effectData(){
    if(this.data.base){
      let effectData = {}
      const baseName = Object.keys(this.data.base)[0]
      const baseDef = PhantomEffects[baseName].def
      if(_.isFunction(baseDef)){
        effectData = baseDef(this.data.base[baseName], this.state)
      }else{
        effectData = baseDef
      }
      effectData = { ...effectData, ...this.data }
      delete effectData.base
      return effectData
    }else{
      return this.data
    }
  }
}