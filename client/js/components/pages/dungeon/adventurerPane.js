import AdventurerInstance from '../../../../../game/adventurerInstance.js'
import { adventurerLoadoutContents } from '../../../adventurer.js'
import { OrbsDisplayStyle } from '../../orbRow.js'
import Modal from '../../modal.js'
import AdventurerInfo from '../../adventurerInfo.js'
import { getAdventurerOrbsData } from '../../../../../game/adventurer.js'

const HTML = `
<div class="flex-rows top-section flex-grow">
  <div class="name"></div>
  <di-hp-bar></di-hp-bar>
  <di-stats-list></di-stats-list>
  <di-orb-row class="adventurer-orbs"></di-orb-row>
</div>
<di-loadout></di-loadout>
`

export default class AdventurerPane extends HTMLElement{

  _orbRow

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this.hpBar = this.querySelector('di-hp-bar')
    this.loadout = this.querySelector('di-loadout')
    this._orbRow = this.querySelector('.adventurer-orbs').setOptions({
      style: OrbsDisplayStyle.MAX_ONLY
    })
    this.statsbox = this.querySelector('.stats-box')
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      iconsOnly: true,
      forced: ['speed','physPower'],
      excluded: ['hpMax']
    })
    this.displayMode = 'normal'

    this.querySelector('.top-section').addEventListener('click', e => {
      if(this.adventurer){
        this._showAdventurerInfoModal()
      }
    })
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = adventurer.name
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

  _showAdventurerInfoModal(){
    const instance = new AdventurerInstance(this.adventurer, this.state)
    const modal = new Modal()
    modal.innerPane.appendChild(new AdventurerInfo(this.adventurer, instance.stats))
    modal.show()
  }
}

customElements.define('di-dungeon-adventurer-pane', AdventurerPane )