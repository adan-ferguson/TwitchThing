import { adventurerLoadoutItem } from '../adventurer.js'

const HTML = `
<div class="inset-title">Item</div>
<di-loadout-row></di-loadout-row>
<div class="stats-text"></div>
<!--<di-stats-list></di-stats-list>-->
<!--<div class='item-abilities'>&#45;&#45; TODO: add other abilities here &#45;&#45;</div>-->
`

export default class ItemDetails extends HTMLElement{

  _loadoutRow
  _statsText
  _statsList
  _abilitiesList

  constructor(loadoutItem = null){
    super()
    this.innerHTML = HTML
    this._loadoutRow = this.querySelector('di-loadout-row')
    this._statsText = this.querySelector('.stats-text')
    // this._statsList = this.querySelector('di-stats-list')
    // this._statsList.setOptions({
    //   statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    // })
    this._abilitiesList = this.querySelector('.item-abilities')
    if(loadoutItem){
      this.setItem(loadoutItem)
    }
  }

  setItem(loadoutItem){
    this._loadoutRow.setItem(loadoutItem, false)
    // this._statsText.innerHTML = item.HTML
    // this._statsList.setStats(item.stats)
  }
}

customElements.define('di-item-details', ItemDetails )