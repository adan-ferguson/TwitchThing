import { OrbsDisplayStyle } from './orbRow.js'

const HTML = `
<div class="item-name"></div>
<di-orb-row class="item-orbs"></di-orb-row>
<di-effect-details></di-effect-details>
`

export default class ItemFullDetails extends HTMLElement{
  setItem(itemInstance){
    this.innerHTML = HTML
    this.querySelector('.item-name').textContent = itemInstance.displayName
    this.querySelector('di-orb-row')
      .setOptions({
        style: OrbsDisplayStyle.MAX_ONLY
      })
      .setData(itemInstance.orbs)
    this.querySelector('di-effect-details')
      .setOptions({
        showTooltips: true
      })
      .setEffect(itemInstance)
    return this
  }
}

customElements.define('di-item-full-details', ItemFullDetails )