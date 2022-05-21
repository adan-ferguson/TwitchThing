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

  _dungeonRunID
  _watchView

  _adventurerPane
  _eventEl
  _stateEl

  dungeonRun

  constructor(dungeonRunID, watchView = false){
    super()
    this._dungeonRunID = dungeonRunID
    this._watchView = watchView
    this.innerHTML = HTML
    this._adventurerPane = this.querySelector('di-dungeon-adventurer-pane')
    this._eventEl = this.querySelector('di-dungeon-event')
    this._stateEl = this.querySelector('di-dungeon-state')
  }

  get titleText(){
    return 'Exploring' + this.dungeonRun ? '' : ' ' + zoneNameFromFloor(this.dungeonRun.floor)
  }

  get currentEvent(){
    return this.dungeonRun.currentEvent || this.dungeonRun.events.at(-1)
  }

  get adventurer(){
    return this.dungeonRun.adventurer
  }

  async load(previousPage){

    const url =
      this._watchView ?
        `/watch/dungeonrun/${this._dungeonRunID}` :
        `/game/dungeonrun/${this._dungeonRunID}`

    const { dungeonRun } = await this.fetchData(url)
    this.dungeonRun = dungeonRun

    if(this.currentEvent.combatID && this.currentEvent.pending && !(previousPage instanceof CombatPage)){
      return this.redirectTo(new CombatPage(this.currentEvent.combatID, {
        live: true,
        returnPage: this
      }))
    }
    if(this.dungeonRun.finished && !this._watchView){
      return this.redirectTo(new ResultsPage(this.adventurer._id))
    }

    getSocket()
      .emit('join dungeon run room', this.dungeonRun._id)
      .on('dungeon run update', this._socketUpdate)

    this._adventurerPane.setAdventurer(this.adventurer)
    this._eventEl.setAdventurer(this.adventurer)
    this._update(dungeonRun, previousPage)
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

    this.dungeonRun = dungeonRun

    if(source === 'socket'){
      if(dungeonRun.finished){
        return this.redirectTo(new ResultsPage(this.dungeonRun._id))
      }
      if(this.currentEvent.combatID){
        // If from a socket event, transition to combat
        return this.redirectTo(
          new CombatPage(this.currentEvent.combatID, {
            returnPage: this
          })
        )
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