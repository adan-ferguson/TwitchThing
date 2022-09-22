export class EffectsData{

  constructor(fighterInstance){
    this._effects = fighterInstance.state.effects
    this._fighterInstance = fighterInstance
  }

  get stateVal(){
    this._cleanup()
    return [...this._effects]
  }

  add(effect){

    if(effect.stacking){
      const existing = this.getById(effect.name)
      if(existing){
        existing.duration = effect.duration
        if(effect.stacking !== 'replace'){
          existing.stacks = (existing.stacks ?? 1) + 1
        }
      }
    }else{
      this._effects.push({ ...effect })
    }

    this._fighterInstance.updateEffectsState()
  }

  /**
   * @param id
   * @returns {[object]}
   */
  getById(id){
    if(!id){
      return []
    }
    return this._effects.find(effect => effect.name === id)
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