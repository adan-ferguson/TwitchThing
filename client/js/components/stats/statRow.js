import { getStatDisplayInfo, StatsDisplayStyle } from '../../statsDisplayInfo.js'
import tippy from 'tippy.js'

const HTML = (name, value, icon = '') => `
<span><span>${icon}</span> <span>${name}</span></span><span class="val">${value}</span>
`

export default class StatRow extends HTMLElement{

  constructor(statsDisplayInfo){
    super()
    this.tippy = tippy(this, {
      theme: 'light'
    })
    this.update(statsDisplayInfo)
    this.setAttribute('stat-key', statsDisplayInfo.stat.name)
  }

  update(statsDisplayInfo){

    if(this.prevStat?.value === statsDisplayInfo.stat.value){
      return
    }

    this.prevStat = statsDisplayInfo.stat

    this.innerHTML = HTML(statsDisplayInfo.text, statsDisplayInfo.displayedValue)
    this.tippy.setContent(statsDisplayInfo.description(statsDisplayInfo.stat))

    this.setAttribute('diff', statsDisplayInfo.stat.diff)
  }
}

customElements.define('di-stat-row', StatRow)