import Stats from '../stats/stats.js'
import { minMax, toDisplayName } from '../utilFunctions.js'
import EffectInstance from '../effectInstance.js'
import { status as StatusEffects } from './combined.js'
import _ from 'lodash'

export default class StatusEffectInstance extends EffectInstance{

  constructor(data, owner, state = {}, ){
    super(owner, state)
    this._data = data
  }

  get calculateBaseEffectData(){
    return explodeEffect(this._data)
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

  get maxStacks(){
    return this.effectData.maxStacks ?? null
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
      return true
    }
    if(Number.isFinite(this.duration) && !this.durationRemaining){
      return true
    }
    if(this.barrier && !this.barrierHp){
      return true
    }
    if(this.stacks === 0){
      return true
    }
    if(this.turns && this.turnsTaken >= this.turns){
      return true
    }
    if(this.abilities[0] && this.abilities[0].uses && !this.abilities[0].usesRemaining){
      return true
    }
    if(this._expired){
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

  get barrierHpMax(){
    return Math.ceil(this.barrier?.hp ?? 0)
  }

  get barrierHp(){
    return this._state.barrierHp ?? this.barrierHpMax
  }

  set barrierHp(val){
    this._state.barrierHp = minMax(0, val, this.barrierHpMax)
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

  get diminishingReturns(){
    return this.effectData.diminishingReturns ?? false
  }

  extend(extendedDuration){
    this._state.extendedDuration = extendedDuration
    return this
  }

  refresh(){
    delete this._state.barrierHp
    delete this._state.time
    return this
  }

  expire(){
    this._expired = true
  }

  replaceData(data){
    this._data = data
    this.invalidate()
    return this
  }

  modifyStacks(amount){
    this._state.stacks = Math.min(this.maxStacks ?? Number.POSITIVE_INFINITY, this.stacks + amount)
    this.invalidate()
    return this
  }

  removeStack(){
    this._state.stacks = Math.max(0, this.stacks - 1)
    this.invalidate()
    return this
  }

  advanceTime(ms){
    super.advanceTime(ms)
    this._state.time = this.time + ms
  }

  nextTurn(){
    if(this.turns && this.time > 0){
      this._state.turnsTaken = this.turnsTaken + 1
    }
  }
}

export function explodeEffect(data){
  if(data.base){
    let effectData = {}
    const baseName = Object.keys(data.base)[0]
    const baseDef = StatusEffects[baseName].def
    if(_.isFunction(baseDef)){
      const params = data.base[baseName]
      effectData = baseDef(params)
      effectData.vars = { ...(effectData.vars ?? {}), params }
    }else{
      effectData = baseDef
    }
    effectData = { statusEffectId: baseName, ...effectData, ...data }
    delete effectData.base
    return effectData
  }
  return data
}