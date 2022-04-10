import tippy from 'tippy.js'
import orbImg from '/client/assets/icons/orb.svg'

const HTML = (name, orbs, icon = '') => `
<div>
    <span>${icon}</span> <span>${name}</span>
</div>
<div class="orb-row">
    <img alt="Orbs" src="${orbImg}"> <span class="orbs-text">${orbs}</span>
</div>
`

export default class LoadoutRow extends HTMLElement{
  constructor(item){
    super()
    this.item = item
    this.tippy = tippy(this, {
      content: () => this.itemTooltip
    })
    this.innerHTML = HTML(item.name, item.orbs)
  }

  get itemTooltip(){
    return JSON.stringify(this.item.stats)
  }
}

customElements.define('di-loadout-row', LoadoutRow)