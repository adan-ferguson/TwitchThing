import LoadoutObject from './loadoutObject.js'

export default class AdventurerLoadoutObject extends LoadoutObject{
  get loadoutModifiers(){
    return this.data.loadoutModifiers ?? null
  }

  withDifferentLevel(level){
    throw 'Not implemented'
  }
}