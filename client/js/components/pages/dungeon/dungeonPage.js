import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import { getSocket } from '../../../socketClient.js'
import ResultsPage from '../results/resultsPage.js'
import CombatPage from '../combat/combatPage.js'

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
    this.eventEl.setAdventurer(adventurer)

    requestAnimationFrame(() => {
      // Let the page attach so it can redirect
      this._parseDungeonUpdate(dungeonRun, false)
    })

    getSocket().on('dungeon run update', this._parseDungeonUpdate)
  }

  async unload(){
    getSocket().off('dungeon run update', this._parseDungeonUpdate)
  }

  _parseDungeonUpdate = (dungeonRun, animate = true) => {

    const currentEvent = dungeonRun.currentEvent || dungeonRun.events.at(-1)

    if(dungeonRun.adventurerID !== this.adventurerID){
      return
    }

    // Don't animate adventurer pane after combat
    this.adventurerPane.setState(dungeonRun.adventurerState, animate && !currentEvent.combatID)
    this.stateEl.updateDungeonRun(dungeonRun, animate)

    if(dungeonRun.finished){
      this._finish()
    }

    if(!currentEvent){
      return
    }

    this.eventEl.update(currentEvent)

    if(currentEvent.combatID && currentEvent.pending){
      return this.redirectTo(new CombatPage(currentEvent.combatID, true, this))
    }
  }

  _finish(){
    setTimeout(() => {
      this.redirectTo(new ResultsPage(this.adventurerID))
    }, 5000)
  }
}

customElements.define('di-dungeon-page', DungeonPage )