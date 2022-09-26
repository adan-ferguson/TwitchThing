import Effect, { EffectStacking } from './effect.js'
import _ from 'lodash'

export class EffectsData{

  _effects = []

  constructor(fighterInstance){
    this._fighterInstance = fighterInstance
  }

  get effects(){
    return [...this._effects]
  }

  get stateVal(){
    return this._effects.map(effect => effect.stateVal)
  }

  set stateVal(val){
    this._effects = []
    val.forEach(effectDef => this.add(effectDef))
  }

  advanceTime(ms){
    this._effects.forEach(effect => {
      effect.advanceTime(ms)
    })
    this._cleanupExpired()
  }

  /**
   * @param effectDef
   * @returns {Effect}
   */
  add(effectDef){

    const existing = this._getByDef(effectDef)
    if(existing){
      if(existing.stacking === EffectStacking.REFRESH){
        return existing.refreshDuration()
      }else if(existing.stacking === EffectStacking.STACKING){
        return existing.addStack().refreshDuration()
      }
    }

    const effect = new Effect(effectDef)
    this._effects.push(effect)
    return effect
  }

  /**
   * @param id
   * @returns {[object]}
   */
  getById(id){
    if(!id){
      return []
    }
    return this._effects.find(effect => effect.id === id)
  }

  getByType(effectType){
    return this._effects.filter(effect => effect.type === effectType)
  }

  hasType(effectType){
    return this._effects.find(effect => effect.type === effectType) ? true : false
  }

  /**
   * Remove expired effects
   */
  _cleanupExpired(){
    this._effects = this._effects.filter(effect => {
      return effect.expired || (effect.combatOnly && !this._fighterInstance.inCombat)
    })
  }

  /**
   * @private
   */
  _getByDef(effectDef){
    return this._effects.find(effect => _.isEqual(effectDef, effect.def))
  }
}