import { adventurerLoadoutItem } from '../adventurer.js'

const HTML = `
<div>
    <span class="icon"></span> <span class="name"></span>
</div>
<di-orb-row></di-orb-row>
<div class="new-badge hidden">New!</div>
`

export default class ItemDetails extends HTMLElement{

  _loadoutRow
  _statsText
  _statsList
  _abilitiesList

  constructor(loadoutItem, options = {}){
    super()
    this.innerHTML = HTML
    this._loadoutRow = this.querySelector('di-loadout-row')
    if(loadoutItem){
      this.setItem(loadoutItem)
    }
  }

  setItem(loadoutItem){
    this._loadoutRow.setItem(loadoutItem, false)
  }
}

customElements.define('di-item-details', ItemDetails )