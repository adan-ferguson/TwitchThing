import EffectInstance from '../effectInstance.js'
import { phantom as PhantomEffects } from './combined.js'
import _ from 'lodash'

export default class PhantomEffectInstance extends EffectInstance{

  constructor(data, owner, parentEffect = null){
    super(explodeEffect(data), owner)
    this._parentEffect = parentEffect
  }

  get uniqueID(){
    return this._parentEffect.uniqueID
  }
}

function explodeEffect(data){
  if(data.base){
    let effectData = {}
    const baseName = Object.keys(data.base)[0]
    const baseDef = PhantomEffects[baseName].def
    if(_.isFunction(baseDef)){
      effectData = baseDef(data.base[baseName])
    }else{
      effectData = baseDef
    }
    effectData = { ...effectData, ...data }
    delete effectData.base
    return effectData
  }
  return data
}