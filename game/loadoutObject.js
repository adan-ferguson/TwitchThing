import { toDisplayName } from './utilFunctions.js'

export default class LoadoutObject{

  _data

  constructor(data){
    if(!data){
      throw 'No data'
    }
    this._data = data
  }

  get name(){
    return this._data.name
  }

  get displayName(){
    return this.data.displayName ?? toDisplayName(this.data.name) ?? 'Unknown Name'
  }

  get data(){
    return this._data
  }

  get conditions(){
    return this.effect.conditions ?? null
  }

  get abilities(){
    return this.effect.abilities ?? []
  }

  get effect(){
    return this.data.effect ?? {}
  }

  get effectData(){
    return this.effect
  }

  get mods(){
    return this.effect.mods ?? []
  }

  get vars(){
    return this.data.vars ?? {}
  }

  get stats(){
    return this.effect.stats ?? {}
  }
}