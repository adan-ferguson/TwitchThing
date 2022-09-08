import AdventurerInstance from '../../../../game/adventurerInstance.js'
import { OrbsDisplayStyle } from '../orbRow.js'
import Modal from '../modal.js'
import AdventurerInfo from './adventurerInfo.js'

const HTML = `
<div class="flex-grow flex-rows top-section">
  <div class="name"></div>
  <di-xp-bar></di-xp-bar>
  <di-stats-list></di-stats-list>
  <di-orb-row class="adventurer-orbs"></di-orb-row>
</div>
<di-loadout></di-loadout>
`

export default class AdventurerPane extends HTMLElement{

  _hpBar
  _actionBar
  orbRow

  _extraStats

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this._name = this.querySelector('div.name')
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)
    this.orbRow = this.querySelector('di-orb-row')
      .setOptions({
        style: OrbsDisplayStyle.SHOW_MAX
      })

    this.loadoutEl = this.querySelector('di-loadout')
    this.statsList = this.querySelector('di-stats-list')
      .setOptions({
        maxItems: 10,
        forced: ['hpMax', 'speed', 'physPower']
      })

    this.querySelector('.top-section').addEventListener('click', e => {
      if(this.adventurer){
        this._showAdventurerInfoModal()
      }
    })
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this._name.textContent = adventurer.name
    this.xpBar.setValue(this.adventurer.xp)
    this.loadoutEl.setContents(adventurerLoadoutContents(this.adventurer))
    this.update()
  }

  setExtraStats(extraStats){
    this._extraStats = extraStats
    this.update()
  }

  update(showStatChangeEffect = false){
    this.updateStats(showStatChangeEffect)
    this.updateOrbs()
    this.loadoutEl.update()
  }

  updateOrbs(){
    this.orbRow.setData(this.loadoutEl.orbsData)
  }

  updateStats(showStatChangeEffect){
    const items = this.loadoutEl.loadoutItems.map(loadoutItem => loadoutItem?.obj)
    const adventurerInstance = new AdventurerInstance({ ...this.adventurer, items }, this._extraStats)
    this.statsList.setStats(adventurerInstance.stats, adventurerInstance, showStatChangeEffect)
  }

  async addXp(toAdd, options = { }){
    await this.xpBar.setValue(this.adventurer.xp + toAdd, {
      ...options,
      onLevelup: level => {
        this.adventurer.level = level
        this.update(true)
        options.onLevelup?.(level)
      }
    })
  }

  _showAdventurerInfoModal(){
    const modal = new Modal()
    modal.innerPane.appendChild(new AdventurerInfo(this.adventurer, this.statsList.stats))
    modal.show()
  }
}

customElements.define('di-adventurer-pane', AdventurerPane )