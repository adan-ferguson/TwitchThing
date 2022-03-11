import getStatDisplayInfo from '../../statsDisplayInfo.js'
import tippy from 'tippy.js'

const HTML = (name, value, icon = '') => `
<span>${icon}</span> <span>${name}</span> <span class="val">${value}</span>
`

export default class StatRow extends HTMLElement{
  constructor(stat){
    super()
    const statDisplayInfo = getStatDisplayInfo(stat)
    this.innerHTML = HTML(statDisplayInfo.text, stat.value)
    tippy(this, {
      content: statDisplayInfo.description(stat)
    })
  }
}

customElements.define('di-stat-row', StatRow)