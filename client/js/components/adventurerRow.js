import './timer.js'
import AdventurerPage from './pages/adventurer/adventurerPage.js'
import DungeonPage from './pages/dungeon/dungeonPage.js'

const HTML = `
<div class="inner">
    <span>
        Lvl.<span class="level"></span>
    </span>
    <span class="name"></span>
    <div class="flex-rows displaynone dungeon-status">
        <span class="event"></span>
        <di-timer class="displaynone"></di-timer>
        <span class="depth"> 
            Floor: <span class="floor"></span>
            Room: <span class="room"></span>
        </span>
    </div>
</div>
<a class="new-tab" target="_blank" title="Open in new tab">[->]</a>
`

export default class AdventurerRow extends HTMLElement{

  _options
  _depth

  constructor(adventurer, options = {}){
    super()

    this._options = {
      newTab: `/game#adventurer=${adventurer._id}`,
      ...options
    }

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
    this._depth = this.querySelector('.depth')
    this._floor = this.querySelector('.floor')
    this._room = this.querySelector('.room')
    this._timer = this.querySelector('di-timer')
    this._event = this.querySelector('.event')

    this._setupNewTabLink()

    if(adventurer.dungeonRun){
      this.setDungeonRun(adventurer.dungeonRun)
    }else if(adventurer.dungeonRunID){
      this.setDungeonRun({
        finished: true
      })
    }
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

    this._event.textContent = eventText()
    this._timer.classList.toggle('displaynone', dungeonRun.finished)
    this._depth.classList.toggle('displaynone', dungeonRun.finished)

    if(!dungeonRun.finished){
      this._room.textContent = dungeonRun.room
      this._floor.textContent = dungeonRun.floor
      this._timer.time = dungeonRun.virtualTime
      this._timer.start()
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

  _setupNewTabLink(){
    const newTab = this.querySelector('.new-tab')
    if(this._options.newTab){
      newTab.setAttribute('href', this._options.newTab)
      newTab.addEventListener('click', e => {
        e.stopPropagation()
      })
    }else{
      newTab.classList.add('hidden')
    }
  }
}

customElements.define('di-adventurer-row', AdventurerRow)