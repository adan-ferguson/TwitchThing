import { all as Effects } from './statusEffects/combined.js'
import Stats from './stats/stats.js'
import { uuid } from './utilFunctions.js'
import EffectInstance from './effectInstance.js'

export default class StatusEffectInstance extends EffectInstance{

  data

  constructor(data, state = {}, owner = null){

    // return {
    //   name: null,
    //   group: 'generic',
    //   displayName: null,
    //   stacking: false, // true | false | 'refresh'
    //   duration: null, // null | integer
    //   combatOnly: true, // boolean
    //   buff: false, // boolean
    //   mods: [],
    //   stats: {},
    //   params: {},
    //   ability: null,
    //   ...baseDef,
    //   ...this.data
    // }

    super(state, owner)
    this._data = data
    this._id = uuid()
  }

  get effectData(){
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
    return effectData
  }

  get id(){
    return this._id
  }

  get stacks(){
    return this.state.stacks || 1
  }

  get stats(){
    return new Stats(Array(this.stacks).fill(this.options.stats))
  }

  get expired(){
    if(this._effectData.duration){
      return this._state.time >= this._effectData.duration
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