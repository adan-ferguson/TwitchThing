import { mergeOptionsObjects } from '../../../game/utilFunctions.js'
import _ from 'lodash'
import { EventEmitter } from 'events'
import tippy from 'tippy.js'
import { getTooltipForStatType } from '../displayInfo/statsDisplayInfo.js'

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

  set forceShowTooltip(val){
    this._tippy[val ? 'show' : 'hide']()
  }

  get inModal(){
    return this.closest('di-modal')
  }

  /**
   * @param options
   * @param forceUpdate
   * @returns {this}
   */
  setOptions(options = {}, forceUpdate = false){
    const newOptions = mergeOptionsObjects(this._options, options)
    if(!forceUpdate && _.isEqual(newOptions, this._options)){
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
        // delay: 50,
        duration: 150,
      })
    }
    if(content && !this.inTooltip){
      this._tippy.enable()
      this._tippy.setContent(content)
    }else{
      this._tippy.disable()
    }
  }

  addTooltipsToStats(){
    this.querySelectorAll('.stat-wrap').forEach(el => {
      const content = getTooltipForStatType(el.getAttribute('stat-type'))
      if(content){
        tippy(el, {
          theme: 'light',
          content
        })
      }
    })
  }

  _update(){

  }

}