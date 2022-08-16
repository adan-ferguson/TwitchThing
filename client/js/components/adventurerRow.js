import './timer.js'
import AdventurerPage from './pages/adventurer/adventurerPage.js'
import DungeonPage from './pages/dungeon/dungeonPage.js'
import ResultsPage from './pages/results/resultsPage.js'
import { OrbsDisplayStyle } from './orbRow.js'
import { getAdventurerOrbsData } from '../../../game/adventurer.js'
import dateFormat from 'dateformat'
import { toDisplayName } from '../../../game/utilFunctions.js'

const HTML = `
<div class="inner">
  <span style="text-align:center">
    <span class="name"></span>
    <di-orb-row></di-orb-row>
  </span>
  <span style="text-align:center">
  <div class="status"></div>
    <div class="description"></div>
  </span>
</div>
`

const DUNGEON_HTML = ({ time, floor, room }) => `
Floor ${floor} - Room ${room} - ${time}
`

export default class AdventurerRow extends HTMLElement{

  _options
  _depth

  constructor(adventurer, options = {}){
    super()

    this._options = {
      newTab: adventurer ? `/game?adventurer=${adventurer._id}` : null,
      ...options
    }

    this.innerHTML = HTML

    if(!adventurer){
      this.querySelector('.inner').textContent = 'Create a new Adventurer'
      return
    }

    this.setAttribute('adventurer-id', adventurer._id)
    this.adventurer = adventurer

    this.querySelector('.name').textContent = this.adventurer.name
    this.querySelector('di-orb-row')
      .setOptions({
        style: OrbsDisplayStyle.MAX_ONLY,
        showTooltips: false
      })
      .setData(getAdventurerOrbsData(adventurer))

    this.setDungeonRun(adventurer.dungeonRun)
  }

  get targetPage(){
    if(!this.dungeonRun){
      return new AdventurerPage(this.adventurer._id)
    }else if(this.dungeonRun.finished){
      return new ResultsPage(this.dungeonRun._id)
    }else{
      return new DungeonPage(this.dungeonRun._id)
    }
  }

  setDungeonRun(dungeonRun){

    const statusEl = this.querySelector('.status')
    const descriptionEl = this.querySelector('.description')
    if(!dungeonRun){
      statusEl.innerHTML = ''
      descriptionEl.style.color = '#888'
      descriptionEl.textContent = 'Idle'
      return
    }else if(dungeonRun.finished){
      statusEl.innerHTML = ''
      descriptionEl.style.color = '#4d8fc4'
      descriptionEl.textContent = 'Finished'
      return
    }

    statusEl.innerHTML = DUNGEON_HTML({
      floor: dungeonRun.floor,
      time: dateFormat(dungeonRun.virtualTime, 'M:ss'),
      room: dungeonRun.room
    })
    descriptionEl.style.color = '#000'
    descriptionEl.textContent = eventText()

    function eventText(){
      const currentEvent = dungeonRun.currentEvent || dungeonRun.events.at(-1)
      if(currentEvent?.monster){
        return `Battling a ${toDisplayName(currentEvent.monster.name)}`
      }else if(currentEvent?.relic){
        return 'Investigating a Relic'
      }
      return 'Exploring'
    }
  }
}

customElements.define('di-adventurer-row', AdventurerRow)