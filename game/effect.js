import { all as Effects } from './effects/combined.js'
import Stats from './stats/stats.js'
import { toDisplayName } from './utilFunctions.js'

export const EffectStacking = {
  NONE: 0,
  STACKING: 1,
  REFRESH: 2
}

export default class Effect{

  data
  state

  constructor(def, state = {}){

    if(!def.name){
      throw 'effectDef missing required value "name"'
    }

    const baseEffectDef = Effects[def.name]

    if(!baseEffectDef){
      throw 'baseEffectDef not found'
    }

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
      ...def
    }

    this.def = def
    this.state = {
      time: 0,
      stacks: 1,
      ...state
    }
  }

  get displayName(){
    return this.data.displayName ?? toDisplayName(this.data.name)
  }

  get expired(){
    if(this.data.duration){
      return this.state.time >= this.data.duration
    }
    return false
  }

  get stateVal(){
    return JSON.parse(JSON.stringify({
      def: this.def,
      state: this.state
    }))
  }

  /**
   * return {Stats}
   */
  get stats(){
    const repetitions = this.data.stacking ? this.state.stacks : 1
    return new Stats(Array(repetitions).fill(this.data.stats))
  }

  /**
   * return {[string]}
   */
  get mods(){
    return this.data.mods
  }

  refreshDuration(){
    this.state.time = 0
    return this
  }

  addStack(){
    if(this.data.stacking){
      this.state.stacks++
    }
    return this
  }

  advanceTime(ms){
    if(this.data.duration){
      this.state.time += ms
    }
  }
}