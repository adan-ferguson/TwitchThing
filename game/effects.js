export class EffectsData{

  _effects = []

  constructor(fighterInstance){
    this._fighterInstance = fighterInstance
  }

  get stateVal(){
    this._cleanup()
    return [...this._effects]
  }

  set stateVal(val){
    this._effects = val ?? []
  }

  advanceTime(ms){
    this.stateVal.forEach(effect => {
      if(effect.duration > 0){
        effect.duration -= ms
      }
    })
  }

  add(effect){

    effect = { ...effect }
    if(effect.stacking){
      const index = this.stateVal.findIndex(e => e.id === effect.id)
      if(index >= 0){
        const existing = this._effects[index]
        existing.duration = effect.duration
        if(effect.stacking !== 'replace'){
          effect.stacks = (existing.stacks ?? 1) + 1
          console.log('stacks', effect.stacks)
        }
        this._effects[index] = effect
        return
      }
    }

    this._effects.push(effect)
  }

  /**
   * @param id
   * @returns {[object]}
   */
  getById(id){
    if(!id){
      return []
    }
    return this.stateVal.find(effect => effect.id === id)
  }

  getByType(effectType){
    return this.stateVal.filter(effect => effect.type === effectType)
  }

  hasType(effectType){
    return this.stateVal.find(effect => effect.type === effectType) ? true : false
  }

  /**
   * Remove expired effects
   */
  _cleanup(){
    this._effects = this._effects.filter(effect => {
      if(effect.duration === 'combat'){
        return this._fighterInstance.inCombat
      }else if(effect.duration === 'perma'){
        return true
      }
      return effect.duration > 0
    })
  }
}