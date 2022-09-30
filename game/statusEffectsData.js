import StatusEffectInstance  from './statusEffectInstance.js'
import _ from 'lodash'

export class StatusEffectsData{

  _instances = []

  constructor(fighterInstance){
    this._fighterInstance = fighterInstance
  }

  get instances(){
    return [...this._instances]
  }

  get stateVal(){
    return this._instances.map(effect => effect.stateVal)
  }

  set stateVal(val){
    this._instances = []
    if(val){
      val.forEach(effectStateVal => {
        this._instances.push(
          new StatusEffectInstance(
            effectStateVal.def,
            this._fighterInstance,
            effectStateVal.state
          ))
      })
    }
  }

  advanceTime(ms){
    this._instances.forEach(effect => {
      effect.advanceTime(ms)
    })
    this._cleanupExpired()
  }

  /**
   * @param statusEffectData {object} StatusEffectInstance parameter
   * @returns {StatusEffectInstance}
   */
  add(statusEffectData){
    const existing = this._getByData(statusEffectData)
    if(existing){
      if(existing.data.stacking === 'refresh'){
        return existing.refreshDuration()
      }else if(existing.data.stacking === true){
        return existing.addStack().refreshDuration()
      }
    }
    const instance = new StatusEffectInstance(statusEffectData, this._fighterInstance)
    this._instances.push(instance)
    return instance
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
   * Remove expired effects
   */
  _cleanupExpired(){
    this._instances = this._instances.filter(effect => {
      return !effect.expired && (!effect.combatOnly || this._fighterInstance.inCombat)
    })
  }

  /**
   * @private
   */
  _getByData(effectDef){
    return this._instances.find(effect => _.isEqual(effectDef, effect.def))
  }
}