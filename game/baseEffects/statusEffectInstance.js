import Stats from '../stats/stats.js'
import { roundToFixed, toDisplayName } from '../utilFunctions.js'
import EffectInstance from '../effectInstance.js'
import { phantom as PhantomEffects, status as StatusEffects } from './combined.js'
import _ from 'lodash'

export default class StatusEffectInstance extends EffectInstance{

  constructor(data, owner, state = {}, ){
    super(owner, state)
    this._data = data
  }

  get data(){
    return this._data
  }

  get stackingId(){
    return this.effectData.stackingId ?? null
  }

  get sourceEffectId(){
    return this._state.sourceEffectId
  }

  get name(){
    return this.effectData.name ?? null
  }

  get displayName(){
    return this.effectData.displayName ?? toDisplayName(this.effectData.name) ?? null
  }

  get effectData(){
    if(this.data.base){
      let effectData = {}
      const baseName = Object.keys(this.data.base)[0]
      const baseDef = StatusEffects[baseName].def
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

  /**
   * @returns {'replace'|boolean}
   */
  get stacking(){
    return this.effectData.stacking ?? false
  }

  get polarity(){
    return this.effectData.polarity ?? 'neutral'
  }

  get stacks(){
    return this._state.stacks ?? 1
  }

  get stats(){
    return new Stats(Array(this.stacks).fill(super.stats))
  }

  get duration(){
    return this.effectData.duration + (this._state.extendedDuration ?? 0)
  }

  get durationRemaining(){
    return Math.max(0, this.duration - this.time)
  }

  get expired(){
    if(!this.fighterInstance.inCombat && !this.persisting){
      return false
    }
    if(Number.isFinite(this.duration) && !this.durationRemaining){
      return true
    }
    if(this.barrier && !this.barrierPointsRemaining){
      return true
    }
    if(this.stacks === 0){
      return true
    }
    if(this.turns && this.turnsTaken >= this.turns){
      return true
    }
    return false
  }

  get time(){
    return this._state.time ?? 0
  }

  get barrier(){
    return this.effectData.barrier ?? null
  }

  get barrierDamage(){
    return this._state.barrierDamage ?? 0
  }

  get barrierPointsRemaining(){
    if(!this.barrier){
      return 0
    }
    return this.barrier.points - this.barrierDamage
  }

  get turns(){
    return this.effectData.turns ?? null
  }

  get turnsTaken(){
    return this._state.turnsTaken ?? 0
  }

  get persisting(){
    return this.effectData.persisting ?? false
  }

  extend(time){
    if(this.duration){
      this._state.extendedDuration = (this._state.extendedDuration ?? 0) + time
    }
    return this
  }

  refresh(){
    if(this.barrier){
      this._state.barrierDamage = 0
    }
    this._state.time = 0
    return this
  }

  addStack(){
    if(this.effectData.stacking){
      this._state.stacks = this.stacks + 1
      this.fighterInstance.uncache()
    }
    return this
  }

  removeStack(){
    if(this.effectData.stacking){
      this._state.stacks = Math.max(0, this.stacks - 1)
    }
    return this
  }

  advanceTime(ms){
    super.advanceTime(ms)
    this._state.time = this.time + ms
  }

  nextTurn(){
    if(this.turns){
      this._state.turnsTaken = this.turnsTaken + 1
    }
  }

  /**
   * @param amount {number}
   * @return {number} Amount reduced
   */
  reduceBarrierPoints(amount){
    if(!this.barrier){
      return 0
    }
    const barrierDamage = Math.min(amount, this.barrierPointsRemaining)
    this._state.barrierDamage = roundToFixed(this.barrierDamage + barrierDamage, 2)
    return barrierDamage
  }
}