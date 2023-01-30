import StatusEffectInstance  from './statusEffectInstance.js'
import _ from 'lodash'
import { toArray } from './utilFunctions.js'
import { all as Effects } from './statusEffects/combined.js'

/**
 * @param sourceEffect
 * @param def
 * @returns {object}
 */
export function expandStatusEffectsDef(sourceEffect, def){
  if(def.name){
    const baseEffect = Effects[def.name]
    if(baseEffect.stateParamsFn){
      return {
        ...def,
        params: baseEffect.stateParamsFn({
          sourceEffect,
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

  set stateVal(val ){
    this._instances = []
    if(val){
      val = JSON.parse(JSON.stringify(val))
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

  nextTurn(){
    this._instances.forEach(sei => sei.nextTurn())
    this.cleanupExpired()
  }

  /**
   * // TODO: maybe this is some sort of event
   * Owner is taking damage, and the damage has been finalized.
   * @param damage {number}
   * @return {object} Damage distribution
   */
  ownerTakingDamage(damage){
    let remaining = damage
    const distribution = {}
    this._instances.forEach(effect => {
      if(!remaining || !effect.barrier){
        return
      }
      remaining -= distribution[effect.effectId] = effect.reduceBarrierPoints(remaining)
    })
    distribution.hp = remaining
    this.cleanupExpired()
    return distribution
  }

  cleanupExpired(){
    this._instances = this._instances.filter(effect => {
      if(!this._fighterInstance.inCombat && !effect.persisting){
        return false
      }
      return !effect.expired
    })
  }

  /**
   * @param statusEffectData {object} StatusEffectInstance parameter
   * @returns {StatusEffectInstance}
   */
  add(statusEffectData){
    const { existing, index } = this._getExisting(statusEffectData)
    if(existing){
      if(existing.stacking === 'replace'){
        const instance = new StatusEffectInstance(statusEffectData, this._fighterInstance)
        this._instances[index] = instance
        return instance
      }else if(existing.stacking === 'extend'){
        return existing.extend(new StatusEffectInstance(statusEffectData, this._fighterInstance).duration)
      }else if(existing.stacking === true){
        return existing.addStack().refresh()
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
  _getExisting(effectData){
    const index = this._instances.findIndex(statusEffectInstance => {
      if(effectData.stackingId && effectData.stackingId === statusEffectInstance.effectData.stackingId){
        return true
      }
      return effectData.sourceEffectId === statusEffectInstance.data.sourceEffectId
    })
    return {
      index,
      existing: this._instances[index]
    }
  }
}