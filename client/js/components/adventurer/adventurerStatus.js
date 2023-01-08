import { OrbsDisplayStyle, OrbsTooltip } from '../orbRow.js'
import dateFormat from 'dateformat'
import MonsterInstance from '../../../../game/monsterInstance.js'
import AdventurerInstance from '../../../../game/adventurerInstance.js'

const HTML = `
<span style="text-align:center">
  <span><span class="name"></span> <span class="subtitle level"></span></span>
  <di-orb-row></di-orb-row>
</span>
<span style="text-align:center">
  <div class="status"></div>
  <div class="description"></div>
</span>
`

const DUNGEON_HTML = ({ time, floor, room }) => `
Floor ${floor} - Room ${room} - ${time}
`

export default class AdventurerStatus extends HTMLElement{

  constructor(adventurer = null){
    super()
    this.innerHTML = HTML
    if(adventurer){
      this.setAdventurer(adventurer)
    }
  }

  setAdventurer(adventurer){

    this.querySelector('.name').textContent = adventurer.name
    this.querySelector('.level').textContent = adventurer.level
    this.querySelector('di-orb-row')
      .setOptions({
        style: OrbsDisplayStyle.MAX_ONLY,
        tooltip: OrbsTooltip.NONE
      })
      .setData(new AdventurerInstance(adventurer).orbs)

    this.setDungeonRun(adventurer.dungeonRun)
    return this
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
      // TODO: fix live event text
      // const currentEvent = dungeonRun.currentEvent || dungeonRun.events.at(-1)
      // if(currentEvent?.monster){
      //   const monsterInstance = new MonsterInstance(currentEvent.monster)
      //   return `Battling a ${monsterInstance.displayName}`
      // }else if(currentEvent?.relic){
      //   return 'Investigating a Relic'
      // }
      return 'Exploring'
    }
  }
}

customElements.define('di-adventurer-status', AdventurerStatus)