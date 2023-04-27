import { mergeOptionsObjects } from '../../../game/utilFunctions.js'
import _ from 'lodash'
import { EventEmitter } from 'events'
import tippy from 'tippy.js'

export default class DIElement extends HTMLElement{

  constructor(){
    super()
    this.events = new EventEmitter() // Because DOM events don't show up in performance tab
    this._options = { ...this.defaultOptions }
    if(this.initialHTML){
      this.innerHTML = this.initialHTML
    }
  }

  get initialHTML(){
    return null
  }

  get defaultOptions(){
    return {}
  }

  get parentPage(){
    return this.closest('.page')
  }

  get inTooltip(){
    return this.closest('.tippy-content')
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

  setTooltip(content = null){
    if(!this._tippy){
      tippy(this, {
        theme: 'light',
        // onHide: () => false,
        maxWidth: 'none',
        delay: 50,
        duration: 150
      })
    }
    if(content && !this.inTooltip){
      this._tippy.enable()
      this._tippy.setContent(content)
    }else{
      this._tippy.disable()
    }
  }

  _update(){

  }

}