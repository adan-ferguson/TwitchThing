import DIElement from '../../diElement.js'
import { OrbsDisplayStyle } from '../../orbRow.js'
import AdventurerInstance from '../../../../../game/adventurerInstance.js'

const HTML = `
<div class="inset-title name"></div>
<div class="absolute-full-size fill-contents standard-contents">
  <di-stats-list class="adventurer-stats"></di-stats-list>
  <di-orb-row class="adventurer-orbs"></di-orb-row>
  <di-adventurer-loadout></di-adventurer-loadout>
</div>
`

export default class AdventurerPane extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.statsListEl
      .setOptions({
        maxItems: 16,
        forced: ['hpMax', 'physPower', 'magicPower']
      })
    this.orbRowEl
      .setOptions({
        style: OrbsDisplayStyle.REMAINING
      })
    // TODO: click more stats
  }

  get statsListEl(){
    return this.querySelector('di-stats-list')
  }

  get loadoutEl(){
    return this.querySelector('di-adventurer-loadout')
  }

  get orbRowEl(){
    return this.querySelector('di-orb-row.adventurer-orbs')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = `${adventurer.level} - ${adventurer.name}`
    this.update()
  }

  update(showChangeEffect = false){
    this._update(showChangeEffect)
  }

  _update(showChangeEffect = false){
    this.loadoutEl.setLoadout(this.adventurer.loadout)
    this.orbRowEl.setData(this.adventurer.orbs, showChangeEffect)

    const adventurerInstance = new AdventurerInstance(this.adventurer)
    this.statsListEl.setStats(adventurerInstance.stats, adventurerInstance, showChangeEffect)
  }
}

customElements.define('di-adventurer-edit-adventurer-pane', AdventurerPane )