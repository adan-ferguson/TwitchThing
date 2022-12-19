import defaultOrbImg from '/client/assets/icons/orbs/default.svg'
import classDisplayInfo from '../classDisplayInfo.js'
import tippy from 'tippy.js'
import OrbsData from '../../../game/orbsData.js'
import DIElement from './diElement.js'

const ORB_ENTRY_HTML = (src, text) => `
  <span>${text}</span> <img src="${src}">
`

export const OrbsDisplayStyle = {
  USED_ONLY: 0,
  SHOW_MAX: 1,
  MAX_ADDITIVE: 2,
  MAX_ONLY: 3
}

export default class OrbRow extends DIElement{

  _orbsData = null

  get defaultOptions(){
    return {
      style: OrbsDisplayStyle.USED_ONLY,
      showTooltips: true,
      allowNegatives: false
    }
  }

  /**
   * @param orbsData
   * @returns {OrbRow}
   */
  setData(orbsData){
    this._orbsData = orbsData instanceof OrbsData ? orbsData : new OrbsData(orbsData)
    this._update()
    return this
  }

  _update(){
    this.classList.toggle('no-tooltips', !this._options.showTooltips)
    this.innerHTML = ''
    if(!this._orbsData){
      return
    }
    this._orbsData.list.forEach(orbDatum => {
      this.appendChild(new OrbEntry(orbDatum, this._options))
    })
  }
}
customElements.define('di-orb-row', OrbRow)

class OrbEntry extends HTMLElement{
  constructor(orbDatum, { style, allowNegatives }){
    super()

    let text
    let used = n(orbDatum.used)
    let max = n(orbDatum.max)
    if(style === OrbsDisplayStyle.SHOW_MAX){
      text = `${used}/${max}`
      this.classList.toggle('error', orbDatum.remaining < 0)
    }else if(style === OrbsDisplayStyle.MAX_ADDITIVE){
      text = (max >= 0 ? '+' : '') + max
    }else if(style === OrbsDisplayStyle.MAX_ONLY){
      text = '' + max
    }else{
      text = '' + used
    }

    const classInfo = classDisplayInfo(orbDatum.className)
    this.style.color = classInfo.color
    this.innerHTML = ORB_ENTRY_HTML(classInfo.orbIcon || defaultOrbImg, text)
    tippy(this, {
      theme: 'light',
      content: `${classInfo.displayName} orbs (use these to equip items)`
    })

    function n(val){
      return allowNegatives ? val : Math.max(0, val)
    }
  }
}

customElements.define('di-orb-entry', OrbEntry)