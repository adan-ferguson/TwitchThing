import tippy from 'tippy.js'

const HTML = ({ text, displayedValue, icon }) => `
<span>${icon ? `<img src="${icon}">` : text}</span> <span class="val">${displayedValue}</span>
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

    this.classList.toggle('no-icon', statsDisplayInfo.icon ? false : true)

    this.prevStat = statsDisplayInfo.stat

    this.innerHTML = HTML(statsDisplayInfo)
    this.tippy.setContent(statsDisplayInfo.description)

    this.setAttribute('diff', statsDisplayInfo.stat.diff)
    this.style.order = statsDisplayInfo.order
  }
}

customElements.define('di-stat-row', StatRow)