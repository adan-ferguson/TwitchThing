import { getStatDisplayInfo, StatsDisplayStyle } from '../../statsDisplayInfo.js'
import tippy from 'tippy.js'

const HTML = (name, value, icon = '') => `
<span><span>${icon}</span> <span>${name}</span></span><span class="val">${value}</span>
`

export default class StatRow extends HTMLElement{

  constructor(stat, options = {}){
    super()
    this.options = {
      style: StatsDisplayStyle.CUMULATIVE,
      ...options
    }
    this.tippy = tippy(this, {
      theme: 'light'
    })
    this.update(stat)
    this.setAttribute('stat-key', stat.name)
  }

  update(stat){

    if(this.prevStat?.value === stat.value){
      return
    }

    this.prevStat = stat

    const statDisplayInfo = getStatDisplayInfo(stat, this.options.style)
    this.innerHTML = HTML(statDisplayInfo.text, statDisplayInfo.displayedValue)
    this.tippy.setContent(statDisplayInfo.description(stat))

    this.setAttribute('diff', stat.diff)
  }
}

customElements.define('di-stat-row', StatRow)