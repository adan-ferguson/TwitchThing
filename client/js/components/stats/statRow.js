import getStatDisplayInfo from '../../statsDisplayInfo.js'
import tippy from 'tippy.js'
import { makeStatObject } from '../../../../game/stats/stats.js'

const HTML = (name, value, icon = '') => `
<span>${icon}</span> <span>${name}</span> <span class="val">${value}</span>
`

export default class StatRow extends HTMLElement{

  /**
   * StatRow(stat)
   * StatRow(name, val)
   */
  constructor(/****/){
    super()

    let stat
    if(arguments[1]){
      stat = makeStatObject(arguments[0], arguments[1])
    }else{
      stat = arguments[0]
    }

    const statDisplayInfo = getStatDisplayInfo(stat)
    this.innerHTML = HTML(statDisplayInfo.text, statDisplayInfo.displayedValue)
    tippy(this, {
      content: statDisplayInfo.description(stat)
    })
  }
}

customElements.define('di-stat-row', StatRow)