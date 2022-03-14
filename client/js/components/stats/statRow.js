import { getStatDisplayInfo, StatsDisplayStyle } from '../../statsDisplayInfo.js'
import tippy from 'tippy.js'
import { makeStatObject } from '../../../../game/stats/stats.js'

const HTML = (name, value, icon = '') => `
<span><span>${icon}</span> <span>${name}</span></span><span class="val">${value}</span>
`

export default class StatRow extends HTMLElement{

  static fromNameAndValue(name, val, options = {}){
    return new StatRow(makeStatObject(name, val), options)
  }

  constructor(stat, options = {}){
    super()
    options = {
      style: StatsDisplayStyle.CUMULATIVE,
      ...options
    }
    const statDisplayInfo = getStatDisplayInfo(stat, options.style)
    this.innerHTML = HTML(statDisplayInfo.text, statDisplayInfo.displayedValue)
    tippy(this, {
      content: statDisplayInfo.description(stat)
    })
  }
}

customElements.define('di-stat-row', StatRow)