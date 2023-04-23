import { toDisplayName } from './utilFunctions.js'

export default class LoadoutObject{

  _data

  constructor(data){
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

  get effect(){
    return this.data.effect ?? {}
  }

  get loadoutModifiers(){
    return this.data.loadoutModifiers ?? null
  }

}