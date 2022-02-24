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

    // TODO: handle ventures
    const { adventurer, dungeonRun, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonrun`)

    if(error){
      throw error
    }

    if(dungeonRun.currentEvent.combat?.state === 'running'){
      return { redirect: new CombatPage(dungeonRun.currentEvent.combat.combatID, this) }
    }

    this.adventurerPane.setAdventurer(adventurer)
    this.adventurerPane.setState(dungeonRun.currentEvent.adventurerState)
    this.stateEl.updateDungeonRun(dungeonRun)
    this.eventEl.update(dungeonRun.currentEvent)

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

    if(dungeonRun.currentEvent.combat?.state === 'running'){
      return this.app.setPage(new CombatPage(dungeonRun.currentEvent.combat.combatID, this))
    }

    if(dungeonRun.finished){
      this._finish()
    }

    this.eventEl.update(dungeonRun.currentEvent)
    this.stateEl.updateDungeonRun(dungeonRun)
  }

  _finish(){
    console.log('run finished, transitioning in 5 seconds')
    setTimeout(() => {
      this.app.setPage(new ResultsPage(this.adventurerID))
    }, 5000)
  }
}

customElements.define('di-dungeon-page', DungeonPage )