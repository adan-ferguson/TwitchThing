import AdventurerInstance, { advLevelToXp, advXpToLevel } from '../../../../game/adventurerInstance.js'
import { OrbsDisplayStyle } from '../orbRow.js'
import Modal from '../modal.js'
import AdventurerInfo from './adventurerInfo.js'
import { magicAttackMod, magicScalingMod, physScalingMod } from '../../../../game/mods/combined.js'

const HTML = `
<div class="name"></div>
<di-orb-row class="fighter-orbs displaynone"></di-orb-row>
<div class="absolute-full-size fill-contents standard-contents">
  <div class="flex-grow flex-rows top-section">
    <di-xp-bar></di-xp-bar>
    <di-stats-list></di-stats-list>
    <di-orb-row class="adventurer-orbs"></di-orb-row>
  </div>
  <di-loadout></di-loadout>
</div>
`

export default class AdventurerPane extends HTMLElement{

  _hpBar
  _actionBar
  orbRow

  _extraStats

  constructor(){
    super()
    this.classList.add('flex-rows')
    this.innerHTML = HTML
    this._name = this.querySelector('div.name')
    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(advXpToLevel, advLevelToXp)
    this.orbRow = this.querySelector('di-orb-row.adventurer-orbs')
      .setOptions({
        style: OrbsDisplayStyle.SHOW_MAX
      })

    this.loadoutEl = this.querySelector('di-loadout')
    this.statsList = this.querySelector('di-stats-list')
      .setOptions({
        maxItems: 10,
        forced: ['hpMax', 'physPower']
      })

    this.querySelector('.top-section').addEventListener('click', e => {
      if(this.adventurerInstance){
        this._showAdventurerInfoModal()
      }
    })
  }

  setAdventurer(adventurer){
    this.adventurerInstance = new AdventurerInstance(adventurer)
    this.adventurerInstance.idle = true
    this._name.textContent = adventurer.name
    this.xpBar.setValue(adventurer.xp)
    this.loadoutEl.setFighterInstance(this.adventurerInstance)
    this.update()
  }

  setExtraStats(extraStats){
    this._extraStats = extraStats
    this.update()
  }

  updateItems(){
    this.adventurerPane.updateStats(true)
    this.adventurerPane.updateOrbs()
  }

  update(showStatChangeEffect = false){
    this.adventurerInstance._itemInstances = this.loadoutEl.loadoutItems.map(loadoutItem => loadoutItem?.itemInstance)
    this.updateStats(showStatChangeEffect)
    this.updateOrbs()
    this.loadoutEl.update()
  }

  updateOrbs(){
    this.orbRow.setData(this.adventurerInstance.orbs)
  }

  updateStats(showStatChangeEffect){
    this.statsList.setOptions({
      excluded: this._excluded()
    }).setStats(this.adventurerInstance.stats, this.adventurerInstance, showStatChangeEffect)
  }

  async addXp(toAdd, options = { }){
    const advData = this.adventurerInstance.fighterData
    this._xpAnimation = true
    await this.xpBar.setValue(advData.xp + toAdd, {
      ...options,
      animate: true,
      skipToEndOfAnimation: options.skipAnimation ? true : false,
      onLevelup: (level, animate = true) => {
        if(animate){
          this.update(true)
        }
        advData.xp = advLevelToXp(level)
        options.onLevelup?.(level)
      }
    })
    this.update(true)
  }

  skipToEndOfXpAnimation(){
    if(this._xpAnimation){
      this._xpAnimation = false
      this.xpBar.skipToEndOfAnimation()
      this.update()
    }
  }

  _showAdventurerInfoModal(){
    const modal = new Modal()
    modal.innerContent.appendChild(new AdventurerInfo(this.adventurerInstance, this.statsList.stats))
    modal.show()
  }

  _excluded(){
    const excluded = []
    const magicAttack = this.adventurerInstance.mods.contains(magicAttackMod)
    const showPhys = this.adventurerInstance.mods.contains(physScalingMod) ||
      this.adventurerInstance.physPower !== this.adventurerInstance.basePower
    const showMagic = this.adventurerInstance.mods.contains(magicScalingMod) ||
      this.adventurerInstance.magicPower !== this.adventurerInstance.basePower

    if((showPhys || !magicAttack) && showMagic){
      return [...excluded]
    }else if(magicAttack && !showPhys){
      return [...excluded, 'physPower']
    }else{
      return [...excluded, 'magicPower']
    }
  }
}

customElements.define('di-adventurer-pane', AdventurerPane )