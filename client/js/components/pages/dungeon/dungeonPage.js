import Page from '../page.js'
import MainPage from '../main/mainPage.js'
import fizzetch from '../../../fizzetch.js'
import { getSocket } from '../../../socketClient.js'

import './stats.js'
import './loadout.js'
import './event.js'
import './state.js'

const HTML = `
<div class='flex-columns'>
  <div class="flex-rows" style="flex-basis:300rem;flex-grow:0">
    <div class="stats content-well">
        <di-dungeon-stats></di-dungeon-stats>
    </div>
    <div class="loadout content-well no-padding">
        <di-loadout></di-loadout>
    </div>
  </div>
  <div class="flex-rows">
    <div class="event content-well">
        <di-dungeon-event></di-dungeon-event>
    </div>
    <div class="state content-well" style="flex-basis:125rem;flex-grow:0">
        <di-dungeon-state></di-dungeon-state>
    </div>
  </div>
</div>
`

export default class DungeonPage extends Page {

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    this.statsEl = this.querySelector('di-dungeon-stats')
    this.loadoutEl = this.querySelector('di-dungeon-loadout')
    this.eventEl = this.querySelector('di-dungeon-event')
    this.stateEl = this.querySelector('di-dungeon-state')
  }

  get backPage(){
    return () => new MainPage()
  }

  async load(){

    // TODO: handle ventures
    const { adventurer, dungeonRun } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonrun`)

    if(!dungeonRun){
      // TODO: error thing
    }

    this.statsEl.setAdventurer(adventurer)
    // this.loadoutEl.setLoadout(adventurer)
    this.stateEl.update(dungeonRun)
    this.eventEl.update(dungeonRun.currentEvent)

    getSocket()
      .emit('view dungeon run', {
        adventurerID: this.adventurerID
      })
      .on('dungeon run update', this._parseSocketEvent)
  }

  async unload(){
    getSocket()
      .off('dungeon run update', this._parseSocketEvent)
      .emit('leave dungeon run')
  }

  _parseSocketEvent = ({ currentEvent, runState }) => {
    this.eventEl.update(currentEvent)
    this.stateEl.update(runState)
  }

  _finish(){
    // TODO: deal with multi-run ventures
    // TODO: go to dungeon run summary
  }
}

customElements.define('di-dungeon-page', DungeonPage )