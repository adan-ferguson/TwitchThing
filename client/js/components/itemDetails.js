import Item from '../../../game/item.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'

const HTML = `
<di-loadout-row></di-loadout-row>
<di-stats-list></di-stats-list>
<div class='item-abilities'>-- TODO: add other abilities here --</div>
`

export default class ItemDetails extends HTMLElement{

  _loadoutRow
  _statsList
  _abilitiesList

  constructor(item = null){
    super()
    this.innerHTML = HTML
    this._loadoutRow = this.querySelector('di-loadout-row')
    this._statsList = this.querySelector('di-stats-list')
    this._statsList.setOptions({
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    })
    this._abilitiesList = this.querySelector('.item-abilities')
    if(item){
      this.setItem(item)
    }
  }

  setItem(itemDef){
    const item = new Item(itemDef)
    this._loadoutRow.setItem(item, false)
    this._statsList.setStats(item.stats)
  }
}

customElements.define('di-item-details', ItemDetails )