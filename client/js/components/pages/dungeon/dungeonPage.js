import Page from '../page.js'
import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import Zones, { floorToZone, floorToZoneName } from '../../../../../game/zones.js'
import Timeline from '../../../../../game/timeline.js'
import AdventurerInstance from '../../../../../game/adventurerInstance.js'
import fizzetch from '../../../fizzetch.js'
import FighterInstancePane from '../../combat/fighterInstancePane.js'
import CombatEnactment from '../../../combatEnactment.js'

const HTML = `
<div class='content-columns'>
  <div class='content-rows'>
    <div class="content-well fill-contents">
      <di-fighter-instance-pane class="adventurer"></di-fighter-instance-pane>
    </div>
    <div class="bot-row content-well">
      <di-dungeon-timeline-controls></di-dungeon-timeline-controls>
    </div>
  </div>
  <div class="content-rows">
    <div class="content-well">
      <di-dungeon-event></di-dungeon-event>
    </div>
    <div class="state bot-row content-well">
      <di-dungeon-state></di-dungeon-state>
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
    this._adventurerPane = this.querySelector('di-fighter-instance-pane.adventurer')
      .setOptions({
        fadeOutOnDefeat: false
      })
    this._eventEl = this.querySelector('di-dungeon-event')
    this._stateEl = this.querySelector('di-dungeon-state')
    this._timelineEl = this.querySelector('di-dungeon-timeline-controls')
    this._timelineEl.ticker.on('tick', () => this._tick())
    this._timelineEl.addEventListener('event_changed', e => {
      this._update(e.detail)
    })
  }

  static get pathDef(){
    return ['dungeonrun', 0]
  }

  get pathArgs(){
    return [this._dungeonRunID]
  }

  get watching(){
    return false //this.dungeonRun?.finalizedData || this.app.publicView
  }

  get titleText(){
    return 'Exploring' + (this.dungeonRun ? ' ' + floorToZoneName(this.dungeonRun.floor) : '')
  }

  get currentEvent(){
    return this._timeline.currentEntry
  }

  get adventurer(){
    return this.dungeonRun.adventurer
  }

  get isReplay(){
    return this.dungeonRun.finished ? true : false
  }

  async load(){

    const { dungeonRun } = await this.fetchData()
    this.dungeonRun = dungeonRun

    if(!this.isReplay){
      joinSocketRoom(this.dungeonRun._id)
      getSocket().on('dungeon run update', this._socketUpdate)
    }

    this._stateEl.setup(dungeonRun)
    this._setupTimeline(dungeonRun)
    this._adventurerPane.setFighter(new AdventurerInstance(this.adventurer, dungeonRun.adventurerState))
    this._eventEl.setAdventurer(this.adventurer)
    this._update({ animate: false })
  }

  async unload(){
    if(!this.isReplay){
      leaveSocketRoom(this.dungeonRun._id)
      getSocket().off('dungeon run update', this._socketUpdate)
    }
    this._timelineEl.destroy()
  }

  _socketUpdate = (dungeonRun) => {
    // Set the virtual time here
    if(this.dungeonRun._id !== dungeonRun._id){
      return
    }
    this.dungeonRun = dungeonRun
    this._timelineEl.addEvent(dungeonRun.currentEvent)
    this._timelineEl.play()
    if(dungeonRun.virtualTime){
      this._timelineEl.jumpTo(dungeonRun.virtualTime)
    }
  }

  _update(options = {}){

    options = {
      animate: true,
      ...options
    }

    const animate = options.animate
    this._adventurerPane.setState(this.currentEvent.adventurerState, animate)
    this._stateEl.update(this._timelineEl.elapsedEvents, animate)

    if(this._ce){
      this._ce.destroy()
    }

    if(this.currentEvent.combatID){
      this._enactCombat(animate)
    }else{
      if(this.dungeonRun.results && this.currentEvent.runFinished){
        this.currentEvent.results = this.dungeonRun.results
      }
      this._eventEl.update(this.currentEvent, animate)
    }

    this._updateBackground()
  }

  async _enactCombat(animate = false){
    const { combat } = await fizzetch(`/game/combat/${this.currentEvent.combatID}`)
    const enemyPane = new FighterInstancePane()
    this._eventEl.setContents(enemyPane, animate)
    const ce = new CombatEnactment(this._adventurerPane, enemyPane, combat)
    ce.on('destroyed', () => {
      this._ce = null
    })
    this._ce = ce
  }

  _tick(){
    if(this._ce){
      this._ce.timeline.time = this._timeline.timeSinceLastEntry
    }
  }

  _updateBackground(){
    const zone = Zones[floorToZone(this.currentEvent.floor)]
    this.app.setBackground(zone.color, zone.texture)
  }

  _setupTimeline(dungeonRun){
    this._timeline = new Timeline(dungeonRun.events)
    if(!dungeonRun.finalized){
      this._timeline.time = dungeonRun.virtualTime ?? dungeonRun.elapsedTime
    }
    this._timelineEl.setup(this._timeline, this.adventurer, {
      isReplay: this.isReplay
    })
  }
}

customElements.define('di-dungeon-page', DungeonPage )