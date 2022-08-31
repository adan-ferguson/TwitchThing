import AdventurerInstance from '../../../../game/adventurerInstance.js'
import { adventurerLoadoutContents } from '../../adventurer.js'
import { OrbsDisplayStyle } from '../orbRow.js'
import Modal from '../modal.js'
import AdventurerInfo from '../adventurer/adventurerInfo.js'
import { getAdventurerOrbsData } from '../../../../game/adventurer.js'
import MonsterInfo from '../monsterInfo.js'

const HTML = `
<div class="name"></div>
<div class="flex-rows top-section flex-grow">
  <di-hp-bar></di-hp-bar>
  <di-action-bar></di-action-bar>
  <di-stats-list></di-stats-list>
  <div>
    Buff/debuff zone
  </div>
  <di-orb-row class="fighter-orbs"></di-orb-row>
</div>
<di-loadout></di-loadout>
`

export default class FighterInstancePane extends HTMLElement{

  _orbRowEl
  _hpBarEl
  _loadoutEl

  _options = {
    inCombat: false
  }

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this._hpBarEl = this.querySelector('di-hp-bar')
    this._actionBarEl = this.querySelector('di-action-bar')
    this._loadoutEl = this.querySelector('di-loadout')
    this._orbRowEl = this.querySelector('.adventurer-orbs').setOptions({
      style: OrbsDisplayStyle.MAX_ONLY
    })
    this.statsList = this.querySelector('di-stats-list').setOptions({
      iconsOnly: true,
      excluded: ['hpMax','speed']
    })

    this.querySelector('.top-section').addEventListener('click', e => {
      this._showFighterInfoModal()
    })
  }

  setFighter(fighterInstance){
    this.fighterInstance = fighterInstance
    this.querySelector('.name').textContent = fighterInstance.displayName
    this.loadout.setContents(adventurerLoadoutContents(adventurer))
    this._orbRow.setData(getAdventurerOrbsData(adventurer))
  }

  setState(state, animate = false){
    this.state = { ...state }
    this._update(animate)
  }

  _update(animateChanges){

    const instance = new AdventurerInstance(this.adventurer, this.state)

    this.hpBar.setOptions({
      max: instance.hpMax
    })

    if(this.state.hp !== this.hpBar.value){
      if(animateChanges){
        this.hpBar.setValue(this.state.hp, {
          animate: true,
          flyingText: true
        })
      }else{
        this.hpBar.setValue(this.state.hp)
      }
    }

    this.statsList.setStats(instance.stats, instance)
  }

  _showFighterInfoModal(){
    const modal = new Modal()
    if(this.fighterInstance.isAdventurer){
      modal.innerPane.appendChild(new AdventurerInfo(this.fighterInstance.baseFighter, this.fighterInstance.stats))
    }else{
      modal.innerPane.appendChild(new MonsterInfo(this.fighterInstance.baseFighter, this.fighterInstance.stats))
    }
    modal.show()
  }
}

customElements.define('di-dungeon-adventurer-pane', FighterInstancePane )