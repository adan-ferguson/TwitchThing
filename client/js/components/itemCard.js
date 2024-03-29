import { OrbsDisplayStyle, OrbsTooltip } from './orbRow.js'
import DIElement from './diElement.js'

const HTML = `
<div class="obj-border">
  <span class="inset-title item-name"></span>
  <di-orb-row class="inset-title-right item-orbs"></di-orb-row>
  <di-effect-details></di-effect-details>
</div>
`

export default class ItemCard extends DIElement{

  get orbEl(){
    return this.querySelector('.item-orbs')
  }

  get nameEl(){
    return this.querySelector('.item-name')
  }

  get loadoutObjectDetails(){
    return this.querySelector('di-effect-details')
  }

  setItem(adventurerItem){
    this.innerHTML = HTML
    if (!adventurerItem){
      return
    }
    this.nameEl.textContent = adventurerItem.displayName
    this.orbEl
      .setOptions({
        style: OrbsDisplayStyle.USED_ONLY,
        tooltip: OrbsTooltip.ITEM
      })
      .setData(adventurerItem.orbs)
    this.loadoutObjectDetails.setObject(adventurerItem)
    this.addTooltipsToStats()
    return this
  }
}

customElements.define('di-item-card', ItemCard)