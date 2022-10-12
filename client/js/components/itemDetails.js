import { OrbsDisplayStyle } from './orbRow.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'

const HTML = `
<div class="inset-title"></div>
<!--<div class="top-part">-->
<!--&lt;!&ndash;  <div class="type-line"></div>&ndash;&gt;-->
<!--</div>-->
<di-ability-description></di-ability-description>
<di-stats-list></di-stats-list>
<div class="item-description"></div>
<di-orb-row></di-orb-row>
`

export default class ItemDetails extends HTMLElement{

  constructor(itemInstance, options = {}){
    super()
    this.innerHTML = HTML
    this.querySelector('.inset-title').textContent = itemInstance.displayName
    // this.querySelector('.type-line').textContent = 'Standard Item'
    this.querySelector('di-orb-row')
      .setOptions({
        style: OrbsDisplayStyle.MAX_ONLY
      })
      .setData(itemInstance.orbs)
    this.querySelector('di-ability-description').setItem(itemInstance)
    this.querySelector('di-stats-list')
      .setOptions({
        statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
      })
      .setStats(itemInstance.stats)
    this.querySelector('.item-description').textContent = 'TODO: effect description same thing for tooltip + details'
  }
}

customElements.define('di-item-details', ItemDetails )