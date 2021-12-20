import Page from '../page.js'
import MainPage from '../main/mainPage.js'
import fizzetch from '../../../fizzetch.js'
import { getSocket } from '../../../socketClient.js'

import './adventurer.js'
import './event.js'
import './state.js'

const HTML = `
<div class='flex-columns'>
    <div class='content-well adventurer'>
        <di-dungeon-adventurer></di-dungeon-adventurer>
    </div>
    <div class='content-well event'>
        <di-dungeon-event></di-dungeon-event>
    </div>
    <div class='content-well right'>
        <di-dungeon-state></di-dungeon-state>
    </div>
</div>
`

export default class DungeonPage extends Page {

  constructor(adventurerID){
    super()
    debugger
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    this.adventurerEl = this.querySelector('di-dungeon-adventurer')
    this.eventEl = this.querySelector('di-dungeon-event')
    this.stateEl = this.querySelector('di-dungeon-state')
  }

  get backPage(){
    return () => new MainPage()
  }

  async load(){

    const { adventurer, currentRunState, currentEvent } = await fizzetch('/game/pagedata/dungeon')
    this.adventurerEl.update(adventurer)
    this.eventEl.update(currentEvent)
    this.stateEl.update(currentRunState)

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
    if(currentEvent){
      this.eventEl.update(currentEvent)
    }
    if(runState){
      this.stateEl.update(runState)
    }
  }

  _finish(){
    // TODO: deal with multi-run ventures
    // TODO: go to dungeon run summary
  }
}

customElements.define('di-dungeon-page', DungeonPage )