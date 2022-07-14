import defaultOrbImg from '/client/assets/icons/orbs/default.svg'
import classDisplayInfo from '../classDisplayInfo.js'
import tippy from 'tippy.js'
import { mergeElementOptions } from '../../../game/utilFunctions.js'
import OrbsData from '../../../game/orbsData.js'

const ORB_ENTRY_HTML = (src, text) => `
  <img src="${src}"> <span>${text}</span>
`

export const OrbsDisplayStyle = {
  USED_ONLY: 0,
  SHOW_MAX: 1,
  MAX_ADDITIVE: 2,
  MAX_ONLY: 3
}

export default class OrbRow extends HTMLElement{

  _orbsData = null
  _options = {
    style: OrbsDisplayStyle.USED_ONLY,
    showTooltips: true
  }

  constructor(){
    super()
  }

  setOptions(options){
    this._options = mergeElementOptions(this._options, options)
    this._update()
  }

  setData(orbsData){
    this._orbsData = orbsData instanceof OrbsData ? orbsData : new OrbsData(orbsData)
    this._update()
  }

  _update(){
    this.classList.toggle('no-tooltips', !this._options.showTooltips)
    this.innerHTML = ''
    if(!this._orbsData){
      return
    }
    this._orbsData.list.forEach(orbDatum => {
      this.appendChild(new OrbEntry(orbDatum, this._options.style))
    })
  }
}
customElements.define('di-orb-row', OrbRow)

class OrbEntry extends HTMLElement{
  constructor(orbDatum, style){
    super()

    let text
    if(style === OrbsDisplayStyle.SHOW_MAX){
      text = `${orbDatum.used}/${orbDatum.max}`
      this.classList.toggle('error', orbDatum.remaining < 0)
    }else if(style === OrbsDisplayStyle.MAX_ADDITIVE){
      text = (orbDatum.max >= 0 ? '+' : '') + orbDatum.max
    }else if(style === OrbsDisplayStyle.MAX_ONLY){
      text = '' + orbDatum.max
    }else{
      text = '' + orbDatum.used
    }

    const classInfo = classDisplayInfo(orbDatum.className)
    this.style.color = classInfo.color
    this.innerHTML = ORB_ENTRY_HTML(classInfo.orbIcon || defaultOrbImg, text)
    tippy(this, {
      theme: 'light',
      content: `These orbs allow this adventurer to equip ${classInfo.displayName} items.\n\n${classInfo.description}`
    })
  }
}

customElements.define('di-orb-entry', OrbEntry)