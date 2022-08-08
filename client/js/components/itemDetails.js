import { OrbsDisplayStyle } from './orbRow.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'

const HTML = `
<div class="inset-title"></div>
<div class="top-part">
  <div class="type-line"></div>
  <div class="description"></div>
</div>
<di-stats-list></di-stats-list>
<di-orb-row></di-orb-row>
<!--<di-stats-list></di-stats-list>-->
<!--<div class='item-abilities'>&#45;&#45; TODO: add other abilities here &#45;&#45;</div>-->
`

export default class ItemDetails extends HTMLElement{

  _loadoutRow
  _statsText
  _statsList
  _abilitiesList

  constructor(itemInstance, options = {}){
    super()
    this.innerHTML = HTML
    this.querySelector('.inset-title').textContent = itemInstance.displayName
    this.querySelector('.type-line').textContent = 'Standard Item'
    this.querySelector('di-orb-row')
      .setOptions({
        style: OrbsDisplayStyle.MAX_ONLY
      })
      .setData(itemInstance.orbs)
    this.querySelector('di-stats-list')
      .setOptions({
        statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
      })
      .setStats(itemInstance.stats)
    this.querySelector('.description').textContent = itemInstance.description
  }
}

customElements.define('di-item-details', ItemDetails )