/*

Effect params:
id: string (required),
displayName: string,
stacking: true | 'replace' | ,
duration: 'combat' | 'dungeon' | integer,
buff: bool,
mods: [],
stats: {object}
 */

export class EffectsData{

  _effects = []

  constructor(fighterInstance){
    this._fighterInstance = fighterInstance
  }

  get stateVal(){
    this._cleanup()
    return JSON.parse(JSON.stringify(this._effects))
  }

  set stateVal(val){
    this._effects = JSON.parse(JSON.stringify(val ?? []))
  }

  advanceTime(ms){
    this._effects.forEach(effect => {
      if(effect.duration > 0){
        effect.duration -= ms
      }
    })
  }

  add(effect){

    effect = {
      duration: 1,
      ...effect
    }

    if(parseInt(effect.duration)){
      effect.initialDuration = effect.duration
    }

    if(effect.stacking){
      const index = this._effects.findIndex(e => e.id === effect.id)
      if(index >= 0){
        const existing = this._effects[index]
        existing.duration = effect.duration
        if(effect.stacking !== 'replace'){
          effect.stacks = (existing.stacks ?? 1) + 1
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
      }else if(effect.duration === 'dungeon'){
        return true
      }
      return effect.duration >= 0
    })
  }
}