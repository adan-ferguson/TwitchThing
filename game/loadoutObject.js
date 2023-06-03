import { toDisplayName } from './utilFunctions.js'

export default class LoadoutObject{

  get data(){
    if(!this._calculatedData){
      this._calculatedData = this.calculateData
    }
    return this._calculatedData
  }

  get calculateData(){
    throw 'No calc data implement'
  }

  get name(){
    return this.data.name
  }

  get displayName(){
    return this.data.displayName ?? toDisplayName(this.data.name) ?? 'Unknown Name'
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

  get metaEffects(){
    return this.effect.metaEffects ?? []
  }

  get mods(){
    return this.effect.mods ?? []
  }

  get exclusiveMods(){
    return this.effect.exclusiveMods ?? []
  }

  get totalMods(){
    return [...this.mods, ...this.exclusiveMods]
  }

  get vars(){
    return this.data.vars ?? {}
  }

  get stats(){
    return this.effect.stats ?? {}
  }

  invalidate(){
    this._calculatedData = null
  }
}