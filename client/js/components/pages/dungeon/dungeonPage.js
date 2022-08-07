import Page from '../page.js'
import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import CombatPage from '../combat/combatPage.js'
import ResultsPage from '../results/resultsPage.js'
import Zones, { floorToZone, floorToZoneName } from '../../../../../game/zones.js'
import Timeline from '../../../../../game/timeline.js'
import tippy from 'tippy.js'
import { mergeOptionsObjects } from '../../../../../game/utilFunctions.js'

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
        <di-dungeon-timeline-controls></di-dungeon-timeline-controls>
    </div>
  </div>
</div>
`

export default class DungeonPage extends Page{

  _dungeonRunID

  _adventurerPane
  _eventEl
  _stateEl
  _timelineEl

  _timeline
  _ticker

  dungeonRun

  constructor(dungeonRunID){
    super()
    this._dungeonRunID = dungeonRunID
    this.innerHTML = HTML
    this._adventurerPane = this.querySelector('di-dungeon-adventurer-pane')
    this._eventEl = this.querySelector('di-dungeon-event')
    this._eventEl.addEventListener('view_combat', () => {
      this._goToCombat()
    })
    this._stateEl = this.querySelector('di-dungeon-state')
    this._timelineEl = this.querySelector('di-dungeon-timeline-controls')
    this._timelineEl.addEventListener('tick', () => {})
    this._timelineEl.addEventListener('event_changed', e => {
      this._update(e.detail)
    })

    this.querySelector('.permalink').addEventListener('click', e => {
      const txt = `${window.location.origin}/watch/dungeonrun/${this.combatID}`
      navigator?.clipboard?.writeText(txt)
      console.log('Copied', txt, navigator?.clipboard ? true : false)
      tippy(e.currentTarget, {
        showOnCreate: true,
        content: 'Link copied to clipboard',
        onHidden(instance){
          instance.destroy()
        }
      })
    })
  }

  get watching(){
    return this.dungeonRun?.finalizedData || this.app.watchView
  }

  get titleText(){
    return 'Exploring' + this.dungeonRun ? '' : ' ' + floorToZoneName(this.dungeonRun.floor)
  }

  get currentEvent(){
    return this._timeline.currentEntry
  }

  get adventurer(){
    return this.dungeonRun.adventurer
  }

  get isReplay(){
    return this.dungeonRun.finalizedData ? true : false
  }

  async load(previousPage){

    const { dungeonRun } = await this.fetchData(`/watch/dungeonrun/${this._dungeonRunID}`)
    this.dungeonRun = dungeonRun

    if(this.dungeonRun.finished && !this.watching){
      return this.redirectTo(new ResultsPage(this._dungeonRunID))
    }

    if(!this.isReplay){
      joinSocketRoom(this.dungeonRun._id)
      getSocket().on('dungeon run update', this._socketUpdate)
    }

    this._setupTimeline(dungeonRun, previousPage)
    this._adventurerPane.setAdventurer(this.adventurer)
    this._eventEl.setAdventurer(this.adventurer)
    this._update({ sourcePage: previousPage, animate: false })
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
    this._timelineEl.jumpTo(dungeonRun.currentEvent.time)
  }

  _update(options = {}){

    options = {
      animate: true,
      viewCombat: this._timelineEl.viewCombat,
      sourcePage: 'self',
      ...options
    }

    if(this.currentEvent.combatID && (!this.isReplay || options.viewCombat)){
      return this._goToCombat()
    }

    if(this.isReplay && this._timelineEl.finished){
      this._finish()
    }

    if(this.currentEvent.finished && this._timelineEl.finished){
      this._finish()
    }

    const animate = options.animate
    this._adventurerPane.setState(this.currentEvent.adventurerState, animate)
    this._stateEl.update(this._timelineEl.elapsedEvents, animate || options.sourcePage instanceof CombatPage)
    this._eventEl.update(this.currentEvent, animate)
    this._updateBackground()
  }

  async _finish(){
    this.redirectTo(new ResultsPage(this.dungeonRun._id))
  }

  _goToCombat(){
    if(!this.currentEvent?.combatID){
      return
    }
    return this.redirectTo(new CombatPage(this.currentEvent.combatID, {
      isReplay: this.isReplay,
      returnPage: this
    }))
  }

  _updateBackground(){
    const zone = Zones[floorToZone(this.currentEvent.floor)]
    this.app.setBackground(zone.color, zone.texture)
  }

  _setupTimeline(dungeonRun, previousPage){
    this._timeline = new Timeline(dungeonRun.events)
    if(previousPage instanceof CombatPage){
      const combatIndex = this._timeline.entries.findIndex(entry => entry.combatID === previousPage.combatID)
      this._timeline.time = this._timeline.entries[combatIndex + 1].time
    }else if(!this.isReplay){
      this._timeline.time = dungeonRun.virtualTime
    }
    this._timelineEl.setup(this._timeline, this.adventurer, {
      isReplay: this.isReplay
    })
  }
}

customElements.define('di-dungeon-page', DungeonPage )