import Page from '../page.js'
import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import CombatPage from '../combat/combatPage.js'
import ResultsPage from '../results/resultsPage.js'
import Zones, { floorToZone, floorToZoneName } from '../../../../../game/zones.js'

const HTML = `
<div class='content-columns'>
  <di-dungeon-adventurer-pane></di-dungeon-adventurer-pane>
  <div class="content-rows">
    <div class="content-well">
        <di-dungeon-event></di-dungeon-event>
    </div>
    <div class="state flex-no-grow content-well">
        <di-dungeon-state></di-dungeon-state>
    </div>
    <div class="flex-no-grow content-well">
        <di-timeline-controls></di-timeline-controls>
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
  _timelineEl

  dungeonRun

  constructor(dungeonRunID, watchView = false){
    super()
    this._dungeonRunID = dungeonRunID
    this._watchView = watchView
    this.innerHTML = HTML
    this._adventurerPane = this.querySelector('di-dungeon-adventurer-pane')
    this._eventEl = this.querySelector('di-dungeon-event')
    this._stateEl = this.querySelector('di-dungeon-state')
    this._timelineEl = this.querySelector('di-timeline-controls')
    this._timelineEl.addEventListener('nextevent', () => this._update())
  }

  get timeline(){
    return this._timelineEl.timeline
  }

  get watching(){
    return this.dungeonRun?.finalizedData || this._watchView
  }

  get titleText(){
    return 'Exploring' + this.dungeonRun ? '' : ' ' + floorToZoneName(this.dungeonRun.floor)
  }

  get currentEvent(){
    return this.timeline.currentEntry
  }

  get adventurer(){
    return this.dungeonRun.adventurer
  }

  get isReplay(){
    return this.dungeonRun.finalizedData ? true : false
  }

  async load(previousPage){

    const url =
      this._watchView ?
        `/watch/dungeonrun/${this._dungeonRunID}` :
        `/game/dungeonrun/${this._dungeonRunID}`

    const { dungeonRun } = await this.fetchData(url)
    this.dungeonRun = dungeonRun
    this._timelineEl.setup(dungeonRun)

    if(previousPage instanceof CombatPage){
      this._timelineEl.jumpToAfterCombat(previousPage.combatID, false)
    }else if(this.isReplay){
      this._timelineEl.jumpTo(0, false)
    }else{
      this._timelineEl.jumpTo(dungeonRun.virtualTime, false)
    }

    if(this.currentEvent.combatID){
      return this._goToCombat()
    }

    if(this.dungeonRun.finished && !this.watching){
      return this.redirectTo(new ResultsPage(this._dungeonRunID))
    }

    this._adventurerPane.setAdventurer(this.adventurer)
    this._eventEl.setAdventurer(this.adventurer)
    this._update(previousPage)

    if(!this.isReplay){
      joinSocketRoom(this.dungeonRun._id)
      getSocket().on('dungeon run update', this._socketUpdate)
    }
  }

  async unload(){
    if(!this.isReplay){
      leaveSocketRoom(this.dungeonRun._id)
      getSocket().off('dungeon run update', this._socketUpdate)
    }
    this._timelineEl.destroy()
  }

  _socketUpdate = (dungeonRun) => {
    if(this.dungeonRun._id !== dungeonRun._id){
      return
    }
    this.dungeonRun = dungeonRun
    this._timelineEl.addEvent(dungeonRun.currentEvent)
    this._update()
  }

  _update(sourcePage = 'self'){

    if(this.dungeonRun.finished && !this.isReplay && !this.watching){
      const delayedFinish = sourcePage === 'socket' || sourcePage instanceof CombatPage
      this._finish(delayedFinish)
    }

    // TODO: ??
    if(this.currentEvent.combatID){
      return this._goToCombat()
    }

    const animate = sourcePage === 'self'
    this._adventurerPane.setState(this.currentEvent.adventurerState, animate)
    this._stateEl.update(this._timelineEl.elapsedEvents, animate || sourcePage instanceof CombatPage)
    this._eventEl.update(this.currentEvent)
    this._updateBackground()
  }

  async _finish(delay){
    if(this.watching){
      return
    }
    if(delay){
      await new Promise(res => setTimeout(res, 3000))
    }
    this.redirectTo(new ResultsPage(this.dungeonRun._id))
  }

  _goToCombat(){
    return this.redirectTo(new CombatPage(this.currentEvent.combatID, {
      live: true,
      returnPage: this
    }))
  }

  _updateBackground(){
    const zone = Zones[floorToZone(this.currentEvent.floor)]
    this.app.setBackground(zone.color, zone.texture)
  }

}

customElements.define('di-dungeon-page', DungeonPage )