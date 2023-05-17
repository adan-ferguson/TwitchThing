import DIElement from '../diElement.js'
import { OrbsDisplayStyle } from '../orbRow.js'
import AdventurerInstance from '../../../../game/adventurerInstance.js'
import { advLevelToXp, advXpToLevel } from '../../../../game/adventurer.js'

const HTML = `
<div class="inset-title name"></div>
<div class="absolute-full-size fill-contents standard-contents">
  <di-xp-bar class="flex-no-grow"></di-xp-bar>
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
    // TODO: click more stats
  }

  get defaultOptions(){
    return {
      hideXpBar: false,
      orbsStyle: OrbsDisplayStyle.MAX_ONLY
    }
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

  get xpBar(){
    return this.querySelector('di-xp-bar')
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.update()
  }

  update(showChangeEffect = false){
    this._update(showChangeEffect)
  }

  async addXp(toAdd, options = { }){
    this._xpAnimation = true
    const total = this.adventurer.xp + toAdd
    await this.xpBar.setValue(total, {
      ...options,
      animate: true,
      skipToEndOfAnimation: options.skipAnimation ? true : false,
      onLevelup: (level, animate = true) => {
        this.adventurer.xp = advLevelToXp(level)
        options.onLevelup?.(level)
        if(animate){
          this.update(true)
        }
      }
    })
    this.adventurer.xp = total
    this.update(true)
  }

  skipToEndOfXpAnimation(){
    if(this._xpAnimation){
      this._xpAnimation = false
      this.xpBar.skipToEndOfAnimation()
      // this.update()
    }
  }

  _update(showChangeEffect = false){
    if(!this.adventurer){
      return
    }
    this.loadoutEl.setAdventurer(this.adventurer)
    this.orbRowEl
      .setOptions({
        style: this._options.orbsStyle
      })
      .setData(this.adventurer.orbsData, showChangeEffect)
    const adventurerInstance = new AdventurerInstance(this.adventurer)
    this.xpBar
      .setLevelFunctions(advXpToLevel, advLevelToXp)
      .setValue(this.adventurer.doc.xp)
    this.xpBar.classList.toggle('displaynone', this._options.hideXpBar)
    this.statsListEl
      .setOptions({
        owner: adventurerInstance
      })
      .setStats(adventurerInstance.stats, showChangeEffect)
    this.querySelector('.name').textContent = `Lv.${this.adventurer.level} - ${this.adventurer.name}`
  }
}

customElements.define('di-adventurer-pane', AdventurerPane )