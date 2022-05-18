import Page from '../page.js'
import { getSocket } from '../../../socketClient.js'
import CombatPage from '../combat/combatPage.js'
import ResultsPage from '../results/resultsPage.js'
import { zoneNameFromFloor } from '../../../../../game/zones.js'

const HTML = `
<div class='content-columns'>
  <di-dungeon-adventurer-pane></di-dungeon-adventurer-pane>
  <div class="content-rows">
    <div class="content-well">
        <di-dungeon-event></di-dungeon-event>
    </div>
    <div class="state content-well" style="flex-basis:125rem;flex-grow:0">
        <di-dungeon-state></di-dungeon-state>
    </div>
  </div>
</div>
`

export default class DungeonPage extends Page{

  _adventurerID
  _dungeonRunID
  _watchView

  _adventurerPane
  _eventEl
  _stateEl

  adventurer
  dungeonRun

  constructor(ID, watchView = false){
    super()
    if(!watchView){
      this._adventurerID = ID
    }else{
      this._dungeonRunID = ID
      this._watchView = true
    }

    this.innerHTML = HTML

    this._adventurerPane = this.querySelector('di-dungeon-adventurer-pane')
    this._eventEl = this.querySelector('di-dungeon-event')
    this._stateEl = this.querySelector('di-dungeon-state')
  }

  get titleText(){
    return 'Exploring' + this.dungeonRun ? ' ' + zoneNameFromFloor(this.dungeonRun.floor) : ''
  }

  get currentEvent(){
    return this.dungeonRun.currentEvent || this.dungeonRun.events.at(-1)
  }

  async load(previousPage){

    const url =
      this._watchView ?
        `/watch/dungeonrun/${this._dungeonRunID}` :
        `/game/adventurer/${this._adventurerID}/dungeonrun`

    const {
      adventurer,
      dungeonRun
    } = await this.fetchData(url)

    this.adventurer = adventurer
    this.dungeonRun = dungeonRun

    if(this.currentEvent.combatID && this.currentEvent.pending && !(previousPage instanceof CombatPage)){
      return this.app.setPage(new CombatPage(this.currentEvent.combatID, {
        live: true,
        returnPage: this
      }))
    }
    if(this.dungeonRun.finished && !this._watchView){
      return this.app.setPage(new ResultsPage(this.adventurer._id))
    }

    getSocket()
      .emit('join dungeon run room', this.dungeonRun._id)
      .on('dungeon run update', this._socketUpdate)

    this._adventurerPane.setAdventurer(adventurer)
    this._eventEl.setAdventurer(adventurer)
    this._update(previousPage)
  }

  async unload(){
    getSocket().off('dungeon run update', this._socketUpdate)
  }

  _socketUpdate = (dungeonRun) => {
    if(this.dungeonRun._id !== dungeonRun._id){
      return
    }
    this._update(dungeonRun, 'socket')
  }

  _update(dungeonRun, source){

    if(source === 'socket'){
      if(dungeonRun.finished){
        return this.redirectTo(new ResultsPage(this.adventurer._id))
      }
      if(this.currentEvent.combatID){
        // If from a socket event, transition to combat
        return this.redirectTo(new CombatPage())
      }
    }

    if(source instanceof CombatPage && !this._watchView){
      setTimeout(() => {
        this.redirectTo(new ResultsPage(this.adventurer._id))
      }, 3000)
    }

    const animate = source === 'socket'
    this._adventurerPane.setState(dungeonRun.adventurerState, animate)
    this._eventEl.update(this.currentEvent, dungeonRun.virtualTime)
    this._stateEl.updateDungeonRun(dungeonRun, animate || source instanceof CombatPage)

  }
}

customElements.define('di-dungeon-page', DungeonPage )