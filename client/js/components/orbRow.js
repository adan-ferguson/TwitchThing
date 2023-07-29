import classDisplayInfo from '../displayInfo/classDisplayInfo.js'
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
  MAX_ONLY: 3,
  REMAINING: 4
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
      this.appendChild(new OrbEntry().setOptions(this._options).setData(orbDatum))
    })
  }
}
customElements.define('di-orb-row', OrbRow)

class OrbEntry extends DIElement{

  constructor(){
    super()
    this._update()
  }

  get defaultOptions(){
    return {
      style: OrbsDisplayStyle.USED_ONLY,
      allowNegatives: false,
      tooltip: OrbsTooltip.NORMAL
    }
  }

  setData({ className, used, max }){
    if(className !== undefined){
      this.setAttribute('orb-class', className)
    }
    if(used !== undefined){
      this.setAttribute('orb-used', used)
    }
    if(max !== undefined){
      this.setAttribute('orb-max', max)
    }
    this._update()
    return this
  }

  _update(){

    const style = this._options.style
    const allowNegatives = this._options.allowNegatives
    const className = this.getAttribute('orb-class')
    const used = n(this.getAttribute('orb-used'))
    const max = n(this.getAttribute('orb-max'))

    let text
    let err = false
    if(style === OrbsDisplayStyle.SHOW_MAX){
      text = `${used}/${max}`
      err = used > max
    }else if(style === OrbsDisplayStyle.MAX_ADDITIVE){
      text = (max >= 0 ? '+' : '') + max
    }else if(style === OrbsDisplayStyle.MAX_ONLY){
      text = '' + max
    }else if(style === OrbsDisplayStyle.REMAINING){
      text = '' + (max - used)
      err = used > max
    }else{
      text = '' + used
    }

    const classInfo = classDisplayInfo(className)
    this.style.color = classInfo.color
    this.innerHTML = ORB_ENTRY_HTML(classInfo.icon, text)
    this.classList.toggle('error', err)

    if(this._options.tooltip !== OrbsTooltip.NONE){
      const tooltipText = this._options.tooltip === OrbsTooltip.ITEM ?
        'Spend this many orbs to equip this item.' :
        `${classInfo.displayName} orbs`
      this.setTooltip(tooltipText)
    }else{
      this.setTooltip(null)
    }

    function n(val){
      return allowNegatives ? val : Math.max(0, val)
    }
  }
}

customElements.define('di-orb-entry', OrbEntry)