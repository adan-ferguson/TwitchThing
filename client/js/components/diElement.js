import { mergeOptionsObjects } from '../../../game/utilFunctions.js'
import _ from 'lodash'
import { EventEmitter } from 'events'

export default class DIElement extends HTMLElement{

  constructor(){
    super()
    this.events = new EventEmitter() // Because DOM events don't show up in performance tab
    this._options = { ...this.defaultOptions }
  }

  get defaultOptions(){
    return {}
  }

  setOptions(options = {}){
    const newOptions = mergeOptionsObjects(this._options, options)
    if(_.isEqual(newOptions, this._options)){
      return this
    }
    this._options = newOptions
    this._update()
    return this
  }

  _update(){

  }

}