import defaultOrbImg from '/client/assets/icons/orbs/default.svg'
import classDisplayInfo from '../classDisplayInfo.js'
import tippy from 'tippy.js'
import OrbsData from '../../../game/orbsData.js'
import DIElement from './diElement.js'

const ORB_ENTRY_HTML = (icon, text) => `
  <span>${text}</span> ${icon}
`

export const OrbsDisplayStyle = {
  USED_ONLY: 0,
  SHOW_MAX: 1,
  MAX_ADDITIVE: 2,
  MAX_ONLY: 3
}

export const OrbsTooltip = {
  NONE: 0,
  NORMAL: 1,
  ITEM: 2
}

export default class OrbRow extends DIElement{

  _orbsData = null

  get defaultOptions(){
    return {
      style: OrbsDisplayStyle.USED_ONLY,
      tooltip: OrbsTooltip.NORMAL,
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
    this.classList.toggle('no-tooltips', this._options.tooltip === OrbsTooltip.NONE)
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
  constructor(orbDatum, { style, allowNegatives, tooltip }){
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
    this.innerHTML = ORB_ENTRY_HTML(classInfo.icon || defaultOrbImg, text)

    const tooltipText = tooltip === OrbsTooltip.ITEM ?
      'Spend this many orbs to equip this item.' :
      `${classInfo.displayName} orbs`

    tippy(this, {
      theme: 'light',
      content: tooltipText
    })

    function n(val){
      return allowNegatives ? val : Math.max(0, val)
    }
  }
}

customElements.define('di-orb-entry', OrbEntry)