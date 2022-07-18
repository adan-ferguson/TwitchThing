import AdventurerInstance from '../../../../../game/adventurerInstance.js'
import { adventurerLoadoutContents } from '../../../adventurer.js'
import { OrbsDisplayStyle } from '../../orbRow.js'

const HTML = `
<div class="flex-grow">
  <div class="flex-rows">
    <div class="name"></div>
    <di-hp-bar></di-hp-bar>
    <di-stats-list></di-stats-list>
  </div>
</div>
<di-loadout></di-loadout>
`

export default class AdventurerPane extends HTMLElement{

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this.hpBar = this.querySelector('di-hp-bar')
    this.loadout = this.querySelector('di-loadout')
    this.loadout.setOptions({
      orbsDisplayStyle: OrbsDisplayStyle.SHOW_MAX
    })
    this.statsbox = this.querySelector('.stats-box')
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      iconsOnly: true,
      exclude: ['hpMax', 'speed']
    })
    this.displayMode = 'normal'
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.querySelector('.name').textContent = adventurer.name
    this.loadout.setContents(adventurerLoadoutContents(adventurer))
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
}

customElements.define('di-dungeon-adventurer-pane', AdventurerPane )