import Item from '../../../game/item.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'

const HTML = `
<div class='item-description'>
    <span class='item-name'></span>
</div>
<di-orb-row></di-orb-row>
<di-stats-list></di-stats-list>
<div class='item-abilities'>-- TODO: add other abilities here --</div>
`

export default class ItemDetails extends HTMLElement{

  _name
  _orbRow
  _statsList
  _abilitiesList

  constructor(item = null){
    super()
    this.innerHTML = HTML
    this._name = this.querySelector('.name')
    this._orbRow = this.querySelector('di-orb-row')
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
    this._name = item.name
    this._orbRow.setValue(item.orbs)
    this._statsList.setStats(item.stats)
  }
}

customElements.define('di-item-details', ItemDetails )