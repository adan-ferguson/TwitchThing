import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import { getSocket } from '../../../socketClient.js'
import ResultsPage from '../results/resultsPage.js'
import CombatPage from '../combat/combatPage.js'

const HTML = `
<div class='flex-rows'>
  <div class='flex-columns'>
    <div class="content-well">
        <di-dungeon-adventurer-pane></di-dungeon-adventurer-pane>
    </div>
    <div class="content-well">
        <di-dungeon-event></di-dungeon-event>
    </div>
  </div>
  <div class="state content-well" style="flex-basis:125rem;flex-grow:0">
      <di-dungeon-state></di-dungeon-state>
  </div>
</div>
`

export default class DungeonPage extends Page{

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    this.adventurerPane = this.querySelector('di-dungeon-adventurer-pane')
    this.eventEl = this.querySelector('di-dungeon-event')
    this.stateEl = this.querySelector('di-dungeon-state')
  }

  async load(){

    const { adventurer, dungeonRun, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonrun`)

    if(error){
      throw error
    }

    this.adventurerPane.setAdventurer(adventurer)

    requestAnimationFrame(() => {
      // Let the page attach so it can redirect
      this._parseDungeonUpdate(dungeonRun)
    })

    getSocket()
      .emit('view dungeon run', {
        adventurerID: this.adventurerID
      })
      .on('dungeon run update', this._parseDungeonUpdate)
  }

  async unload(){
    getSocket()
      .off('dungeon run update', this._parseDungeonUpdate)
      .emit('leave dungeon run', {
        adventurerID: this.adventurerID
      })
  }

  _parseDungeonUpdate = dungeonRun => {

    const currentEvent = dungeonRun.currentEvent || dungeonRun.events.at(-1)

    if(currentEvent.combatID && currentEvent.pending){
      debugger
      return this.app.setPage(new CombatPage(currentEvent.combatID, true, this))
    }

    this.adventurerPane.setState(dungeonRun.adventurerState)
    this.stateEl.updateDungeonRun(dungeonRun)
    this.eventEl.update(currentEvent)

    if(dungeonRun.finished){
      this._finish()
    }
  }

  _finish(){
    setTimeout(() => {
      this.app.setPage(new ResultsPage(this.adventurerID))
    }, 5000)
  }
}

customElements.define('di-dungeon-page', DungeonPage )