import { all as Effects } from './statusEffects/combined.js'
import Stats from './stats/stats.js'
import { toDisplayName } from './utilFunctions.js'
import EffectInstance from './effectInstance.js'
import _ from 'lodash'

export default class StatusEffectInstance extends EffectInstance{

  owner = null
  data
  state

  constructor(data, owner = null, state = {}){
    super()
    this.data = data
    this.owner = owner
    this.state = {
      time: 0,
      stacks: 1,
      ...state
    }

    if(!this.baseEffect){
      throw 'Base effect not found'
    }
  }

  get options(){
    return {
      name: null,
      group: 'generic',
      displayName: null,
      stacking: false, // true | false | 'refresh'
      duration: null, // null | integer
      combatOnly: true, // boolean
      buff: false, // boolean
      mods: [],
      stats: {},
      params: {},
      ability: null,
      ...this.baseEffect.def,
      ...this.data
    }
  }

  get baseEffect(){
    return Effects[this.data.name]
  }

  get displayName(){
    return this.options.displayName ?? toDisplayName(this.options.name)
  }

  get expired(){
    if(this.options.duration){
      return this.state.time >= this.options.duration
    }
    return false
  }

  get stateVal(){
    return JSON.parse(JSON.stringify({
      data: this.data,
      state: this.state
    }))
  }

  /**
   * return {Stats}
   */
  get stats(){
    const repetitions = this.options.stacking ? this.state.stacks : 1
    return new Stats(Array(repetitions).fill(this.options.stats))
  }

  /**
   * return {[string]}
   */
  get mods(){
    return this.options.mods
  }

  refreshDuration(){
    this.state.time = 0
    return this
  }

  addStack(){
    if(this.options.stacking){
      this.state.stacks++
    }
    return this
  }

  advanceTime(ms){
    this.state.time += ms
  }

  /**
   * @param combat
   */
  apply(combat){
    if(this.baseEffect.apply){
      return this.baseEffect.apply(combat, this.owner)
    }
  }
}

export function applyStatusEffect({ effectDef, combat, source, subject, options }){
  // effectDef = _.isFunction(effectDef) ? effectDef({
  //   source,
  //   params: options.params ?? {}
  // }) : effectDef

  const effectData = {
    ...JSON.parse(JSON.stringify(options)),
    name: effectDef.name,
    source: source.uniqueID
  }

  return subject.gainStatusEffect(effectData)
}