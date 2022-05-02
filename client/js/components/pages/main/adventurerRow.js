import '../../timer.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'

const HTML = `
<div class="inner">
    <span>
        Lvl.<span class="level"></span>
    </span>
    <span class="name"></span>
    <div class="flex-rows displaynone dungeon-status">
        <span class="event"></span>
        <di-timer class="displaynone"></di-timer>
        <span class="status"> 
            Floor: <span class="floor"></span>
            Room: <span class="room"></span>
        </span>
    </div>
</div>
<a class="new-tab" target="_blank" title="Open in new tab">[->]</a>
`

export default class AdventurerRow extends HTMLElement{
  constructor(adventurer){
    super()

    this.innerHTML = HTML

    if(!adventurer){
      this.querySelector('.inner').textContent = 'Create a new Adventurer'
      this.querySelector('.new-tab').classList.add('hidden')
      return
    }

    this.setAttribute('adventurer-id', adventurer._id)
    this.adventurer = adventurer

    this.querySelector('.name').textContent = this.adventurer.name
    this.querySelector('.level').textContent = this.adventurer.level

    this._dungeonStatus = this.querySelector('.dungeon-status')
    this._floor = this.querySelector('.floor')
    this._room = this.querySelector('.room')
    this._timer = this.querySelector('di-timer')
    this._event = this.querySelector('.event')

    const newTab = this.querySelector('.new-tab')
    newTab.setAttribute('href', `/game#adventurer=${adventurer._id}`)
    newTab.addEventListener('click', e => {
      e.stopPropagation()
    })
  }

  get targetPage(){
    if(!this.dungeonRun){
      return new AdventurerPage(this.adventurer._id)
    }else{
      return new DungeonPage(this.adventurer._id)
    }
  }

  setDungeonRun(dungeonRun){

    this.dungeonRun = dungeonRun
    this._dungeonStatus.classList.toggle('displaynone', dungeonRun ? false : true)

    if(!dungeonRun){
      return
    }

    this._floor.textContent = dungeonRun.floor
    this._room.textContent = dungeonRun.room
    this._event.textContent = eventText()

    if(!dungeonRun.finished){
      this._timer.time = dungeonRun.virtualTime
      this._timer.classList.remove('displaynone')
      this._timer.start()
    }else{
      this._timer.classList.add('displaynone')
    }

    function eventText(){
      if(dungeonRun.finished){
        return 'Finished'
      }
      const currentEvent = dungeonRun.currentEvent || dungeonRun.events.at(-1)
      if(currentEvent?.monster){
        return `VS. ${currentEvent.monster.name}`
      }
      return 'Exploring'
    }
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow)