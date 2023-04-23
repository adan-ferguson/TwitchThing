import { OrbsDisplayStyle, OrbsTooltip } from '../orbRow.js'

const HTML = `
<div class="obj-border">
  <span class="inset-title item-name"></span>
  <di-loadout-object-details></di-loadout-object-details>
</div>
`

export default class MonsterItemCard extends HTMLElement{

  get orbEl(){
    return this.querySelector('.item-orbs')
  }

  get nameEl(){
    return this.querySelector('.item-name')
  }

  get loadoutObjectDetails(){
    return this.querySelector('di-loadout-object-details')
  }

  setItem(monsterItem){
    this.innerHTML = HTML
    if (!monsterItem){
      return
    }
    debugger
    this.nameEl.textContent = monsterItem.displayName
    this.loadoutObjectDetails.setObject(monsterItem)
    return this
  }
}

customElements.define('di-monster-item-card', MonsterItemCard)