import { all as Effects } from './statusEffects/combined.js'
import Stats from './stats/stats.js'
import { uuid } from './utilFunctions.js'
import EffectInstance from './effectInstance.js'

export default class StatusEffectInstance extends EffectInstance{

  constructor(data, owner, state = {}, ){
    super(owner, state)
    this._data = data
    this.effectId = 'statusEffect-' + uuid()
  }

  get phantom(){
    return this.data.name ? false : true
  }

  get data(){
    return this._data
  }

  get effectData(){
    if(this.phantom){
      return this.data
    }
    let effectData
    const baseDef = Effects[this._data.name]
    if(baseDef.defFn){
      effectData = {
        name: baseDef.name,
        group: baseDef.group,
        ...baseDef.defFn(this._data.params, this._state)
      }
    }else{
      effectData = baseDef
    }
    return {
      ...effectData,
      ...this.data
    }
  }

  /**
   * @returns {'refresh'|boolean}
   */
  get stacking(){
    return this.effectData.stacking ?? false
  }

  get isBuff(){
    return this.effectData.isBuff ?? false
  }

  get stacks(){
    return this._state.stacks ?? 1
  }

  get stats(){
    return new Stats(Array(this.stacks).fill(super.stats))
  }

  get duration(){
    return this.effectData.duration
  }

  get expired(){
    if(Number.isFinite(this.duration)){
      return (this._state.time ?? 0) >= this.duration
    }
    return false
  }

  get state(){
    const state = super.state
    state.data = this._data
    return state
  }

  refreshDuration(){
    this._state.time = 0
    return this
  }

  addStack(){
    if(this.effectData.stacking){
      this._state.stacks = this.stacks + 1
    }
    return this
  }

  fixState(){
    super.fixState()
    if(!this._state.time){
      this._state.time = 0
    }
  }

  advanceTime(ms){
    super.advanceTime(ms)
    this._state.time += ms
  }
}