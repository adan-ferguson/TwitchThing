import { OrbsDisplayStyle, OrbsTooltip } from './orbRow.js'

const HTML = `
<div class="card-border">
  <span class="inset-title item-name"></span>
  <di-orb-row class="inset-title-right item-orbs"></di-orb-row>
  <di-loadout-object-details></di-loadout-object-details>
</div>
`

export default class ItemCard extends HTMLElement{

  get orbEl(){
    return this.querySelector('.item-orbs')
  }

  get nameEl(){
    return this.querySelector('.item-name')
  }

  get effectDetails(){
    return this.querySelector('di-loadout-object-details')
  }

  setItem(itemInstance){
    this.innerHTML = HTML
    if (!itemInstance){
      return
    }
    this.nameEl.textContent = itemInstance.displayName
    this.orbEl
      .setOptions({
        style: OrbsDisplayStyle.MAX_ONLY,
        tooltip: OrbsTooltip.ITEM
      })
      .setData(itemInstance.orbs)
    this.effectDetails
      .setOptions({
        showTooltips: true
      })
      .setEffect(itemInstance)
    return this
  }
}

customElements.define('di-item-card', ItemCard)