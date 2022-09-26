import { all as Effects } from './effects/combined.js'
import Stats from './stats/stats.js'

export const EffectStacking = {
  NONE: 0,
  STACKING: 1,
  REFRESH: 2
}

export default class Effect{

  data
  time
  stacks

  constructor(effectDef){

    if(!effectDef.name){
      throw 'effectDef missing required value "name"'
    }

    const baseEffectDef = Effects[effectDef.id]

    this.data = {
      name: null,
      group: 'generic',
      displayName: null,
      stacking: EffectStacking.NONE, // EffectStacking.SOMETHING
      duration: null, // null | integer
      combatOnly: true, // boolean
      buff: false, // boolean
      mods: [],
      stats: {},
      ...baseEffectDef,
      ...effectDef
    }

    this.def = effectDef
    this.time = 0
    this.stacks = 1
  }

  get expired(){
    if(this.data.duration){
      return this.time >= this.data.duration
    }
    return false
  }

  get stateVal(){
    const val = {
      def: this.def
    }
    if(this.data.duration){
      val.time = this.time
    }
    if(this.data.stacking){
      val.stacks = this.stacks
    }
    return val
  }

  /**
   * return {Stats}
   */
  get stats(){
    const repetitions = this.data.stacking ? this.stacks : 1
    return new Stats(Array(repetitions).fill(this.data.stats))
  }

  /**
   * return {[string]}
   */
  get mods(){
    return this.data.mods
  }

  refreshDuration(){
    this.time = 0
    return this
  }

  addStack(){
    if(this.data.stacking){
      this.stacks++
    }
    return this
  }

  advanceTime(ms){
    if(this.data.duration){
      this.time += ms
    }
  }
}