import { all as Effects } from './statusEffects/combined.js'
import Stats from './stats/stats.js'
import { toDisplayName } from './utilFunctions.js'
import EffectInstance from './effectInstance.js'

export default class StatusEffectInstance extends EffectInstance{

  data

  constructor(data, owner = null, state = {}){
    super(owner)
    this.data = data
    if(!this.baseEffect){
      throw 'Base effect not found'
    }
    this.options = this._makeOptions()
    this.setState(state)
  }

  get id(){
    return this.options.name
  }

  get ability(){
    return this.options.ability
  }

  get mods(){
    return this.options.mods ?? []
  }

  get stacks(){
    return this.state.stacks || 1
  }

  get stats(){
    return new Stats(Array(this.stacks).fill(this.options.stats))
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

  refreshDuration(){
    this._state.time = 0
    return this
  }

  addStack(){
    if(this.options.stacking){
      this._state.stacks = this.stacks + 1
    }
    return this
  }

  setState(newState = {}){
    super.setState(newState)
    if(!this._state.time){
      this._state.time = 0
    }
  }

  advanceTime(ms){
    super.advanceTime(ms)
    this._state.time += ms
  }

  _makeOptions(){
    let baseDef = this.baseEffect
    if(baseDef.defFn){
      baseDef = {
        name: baseDef.name,
        group: baseDef.group,
        ...baseDef.defFn(this.data.params)
      }
    }
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
      ...baseDef,
      ...this.data
    }
  }
}