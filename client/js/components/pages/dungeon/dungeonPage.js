import Page from '../page.js'
import MainPage from '../main/mainPage.js'
import fizzetch from '../../../fizzetch.js'
import { getSocket } from '../../../socketClient.js'
import ResultsPage from '../results/resultsPage.js'

const HTML = `
<div class='flex-rows'>
  <div class='flex-columns'>
    <di-dungeon-adventurer-well></di-dungeon-adventurer-well>
    <div class="event content-well">
        <di-dungeon-event></di-dungeon-event>
    </div>
  </div>
  <div class="state content-well" style="flex-basis:125rem;flex-grow:0">
      <di-dungeon-state></di-dungeon-state>
  </div>
</div>
`

export default class DungeonPage extends Page {

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    this.adventurerWell = this.querySelector('di-dungeon-adventurer-well')
    this.eventEl = this.querySelector('di-dungeon-event')
    this.stateEl = this.querySelector('di-dungeon-state')
  }

  get backPage(){
    return () => new MainPage()
  }

  async load(){

    // TODO: handle ventures
    const { adventurer, dungeonRun, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonrun`)

    if(error){
      throw error
      // TODO: handle error
      // TODO: if we should be on the combat page, navigate there
    }

    this.adventurerWell.setAdventurer(adventurer)
    this.adventurerWell.setState(dungeonRun.currentEvent.adventurerState)
    this.stateEl.updateDungeonRun(dungeonRun)
    this.stateEl.updateVenture(adventurer.currentVenture)
    this.eventEl.update(dungeonRun.currentEvent)

    getSocket()
      .emit('view dungeon run', {
        adventurerID: this.adventurerID
      })
      .on('dungeon run update', this._parseDungeonUpdate)
      .on('venture update', this._parseVentureUpdate)
  }

  async unload(){
    getSocket()
      .off('dungeon run update', this._parseDungeonUpdate)
      .off('venture update', this._parseVentureUpdate)
      .emit('leave dungeon run', {
        adventurerID: this.adventurerID
      })
  }

  _parseDungeonUpdate = dungeonRun => {

    if(dungeonRun.currentEvent.combat?.state === 'finished'){
      return this.app.setPage(new CombatPage(dungeonRun.currentEvent.combat.id))
    }

    this.eventEl.update(dungeonRun.currentEvent)
    this.stateEl.updateDungeonRun(dungeonRun)
  }

  _parseVentureUpdate = venture => {
    if(venture.finished){
      this._finish()
    }else{
      this.stateEl.updateVenture(venture)
    }
  }

  _finish(){
    // TODO: deal with multi-run ventures
    this.app.setPage(new ResultsPage(this.adventurerID))
  }
}

customElements.define('di-dungeon-page', DungeonPage )