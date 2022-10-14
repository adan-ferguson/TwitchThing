import StatusEffectInstance  from './statusEffectInstance.js'
import _ from 'lodash'
import { toArray } from './utilFunctions.js'
import { all as Effects } from './statusEffects/combined.js'

/**
 * @param actor
 * @param def
 * @returns {object}
 */
export function expandStatusEffectsDef(actor, def){
  if(def.name){
    const baseEffect = Effects[def.name]
    if(baseEffect.stateParamsFn){
      return {
        ...def,
        params: baseEffect.stateParamsFn({
          source: actor,
          params: def.params
        })
      }
    }
  }
  return { ...def }
}

export class StatusEffectsData{

  _instances = []

  constructor(fighterInstance){
    this._fighterInstance = fighterInstance
  }

  get instances(){
    return [...this._instances]
  }

  get stateVal(){
    return this._instances.map(effect => effect.state)
  }

  set stateVal(val){
    this._instances = []
    if(val){
      val.forEach(effectStateVal => {
        this._instances.push(
          new StatusEffectInstance(
            effectStateVal.data,
            this._fighterInstance,
            effectStateVal
          ))
      })
    }
  }

  advanceTime(ms){
    this._instances.forEach(effect => {
      effect.advanceTime(ms)
    })
    this.cleanupExpired()
  }

  /**
   * Remove expired effects
   */
  cleanupExpired(){
    this._instances = this._instances.filter(effect => {
      return !effect.expired && (!effect.combatOnly || this._fighterInstance.inCombat)
    })
  }

  /**
   * @param statusEffectData {object} StatusEffectInstance parameter
   * @returns {StatusEffectInstance}
   */
  add(statusEffectData){
    const existing = this._getByData(statusEffectData)
    if(existing){
      if(existing.stacking === 'refresh'){
        return existing.refreshDuration()
      }else if(existing.stacking === true){
        return existing.addStack().refreshDuration()
      }
    }
    const instance = new StatusEffectInstance(statusEffectData, this._fighterInstance)
    this._instances.push(instance)
    return instance
  }

  remove(toRemove){
    toRemove = toArray(toRemove)
    this._instances = this._instances.filter(instance => {
      if(toRemove.indexOf(instance) > -1){
        return false
      }
      return true
    })
  }

  /**
   * @param id
   * @returns {[object]}
   */
  getById(id){
    if(!id){
      return []
    }
    return this._instances.find(effect => effect.id === id)
  }

  getByType(effectType){
    return this._instances.filter(effect => effect.type === effectType)
  }

  hasType(effectType){
    return this._instances.find(effect => effect.type === effectType) ? true : false
  }

  /**
   * @private
   */
  _getByData(effectData){
    return this._instances.find(statusEffectInstance => {
      return _.isEqual(effectData, statusEffectInstance.data)
    })
  }
}