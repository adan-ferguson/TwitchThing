import Page from '../page.js'
import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import Zones, { floorToZone, floorToZoneName } from '../../../../../game/zones.js'
import Timeline from '../../../../../game/timeline.js'
import AdventurerInstance from '../../../../../game/adventurerInstance.js'
import fizzetch from '../../../fizzetch.js'
import FighterInstancePane from '../../combat/fighterInstancePane.js'
import CombatEnactment from '../../../combatEnactment.js'
import EventContentsResults from './eventContentsResults.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import { showLoader } from '../../../loader.js'

const HTML = `
<div class='content-columns'>
  <div class='content-rows'>
    <div class="content-well fill-contents">
      <di-fighter-instance-pane class="adventurer"></di-fighter-instance-pane>
      <di-adventurer-pane class="displaynone"></di-adventurer-pane>
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

  dungeonRun

  constructor(dungeonRunID){
    super()
    this._dungeonRunID = dungeonRunID
    this.innerHTML = HTML
    this._adventurerPane = this.querySelector('di-fighter-instance-pane.adventurer')
    this._adventurerResultsPane = this.querySelector('di-adventurer-pane')
    this._eventEl = this.querySelector('di-dungeon-event')
    this._stateEl = this.querySelector('di-dungeon-state')
    this._timelineEl = this.querySelector('di-dungeon-timeline-controls')
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

  get isMyAdventurer(){
    if(!this.app.user || !this.adventurer){
      return false
    }
    return this.app.user._id === this.adventurer.userID
  }

  get watching(){
    return this.dungeonRun.finalized || !this.isMyAdventurer
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

  get adventurerInstance(){
    return new AdventurerInstance(this.adventurer, this.currentEvent?.adventurerState ?? {})
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
    this._eventEl.setup(this.adventurer, this._timeline)
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

    if(this.dungeonRun._id !== dungeonRun._id){
      return
    }

    this.dungeonRun = dungeonRun
    this._timelineEl.addEvents(dungeonRun.newEvents)
    this._timelineEl.play()

    if(dungeonRun.finished){
      this._timelineEl.setOptions({
        isReplay: true
      })
    }

    if(dungeonRun.virtualTime){
      this._timelineEl.jumpTo(dungeonRun.virtualTime)
    }
  }

  _update(options = {}){

    options = {
      animate: true,
      ...options
    }

    if(this._ce){
      this._ce.destroy()
    }

    const animate = options.animate

    if(this.currentEvent && !this.isReplay){
      setTimeout(() => {
        this._timelineEl.play()
      })
    }

    this._updateBackground()
    this._stateEl.update(this._timelineEl.elapsedEvents, this.adventurerInstance, animate)

    if(this.isReplay && this._timeline.finished){
      this._showResults()
      return
    }

    this._adventurerPane.classList.remove('displaynone')
    this._adventurerResultsPane.classList.add('displaynone')

    if(this.currentEvent.roomType === 'combat'){
      this._enactCombat()
    }else{
      this._eventEl.update(this.currentEvent, animate)
      this._adventurerPane.setState(this.currentEvent.adventurerState ?? {}, animate)
    }
  }

  _showResults(){
    if(this._eventEl.currentContents instanceof EventContentsResults){
      return
    }
    if(!this.dungeonRun.results){
      return
    }
    const results = new EventContentsResults()
    this._eventEl.setContents(results, false)
    this._timelineEl.pause()
    this._adventurerResultsPane.classList.remove('displaynone')
    this._adventurerPane.classList.add('displaynone')
    if(!this.watching){
      fizzetch(`/game/dungeonrun/${this._dungeonRunID}/finalize`)
    }
    if(this.isMyAdventurer){
      results.showFinalizerButton(() => {
        this.redirectTo(AdventurerPage.path(this.adventurer._id))
      })
    }
    results.play(this.dungeonRun, this._adventurerResultsPane, this.watching)
  }

  async _enactCombat(){
    const { combat } = await fizzetch(`/game/combat/${this.currentEvent.combatID}`)
    const enemyPane = new FighterInstancePane()
    this._eventEl.setContents(enemyPane, false)
    const ce = new CombatEnactment(this._adventurerPane, enemyPane, combat)
    ce.timeline.setTime(this._timeline.timeSinceLastEntry, true)
    ce.on('destroyed', () => {
      this._ce = null
    })
    this._ce = ce
  }

  _timeChange({ before, after, jumped }){
    if(!this.currentEvent){
      return
    }
    if(this._ce && this.currentEvent.roomType === 'combat'){
      this._ce.timeline.setTime(this._timeline.timeSinceLastEntry, jumped)
    }
    if(this._timeline.finished && this.isReplay){
      this._showResults()
    }
  }

  _updateBackground(){
    if(!this.currentEvent){
      return
    }
    const zone = Zones[floorToZone(this.currentEvent.floor)]
    this.app.setBackground(zone.color, zone.texture)
  }

  _setupTimeline(dungeonRun){
    const targetTime = dungeonRun.finalized ? 0 : dungeonRun.virtualTime ?? dungeonRun.elapsedTime
    this._timeline = new Timeline(dungeonRun.events, targetTime)
    this._timeline.on('timechange', obj => {
      this._timeChange(obj)
    })
    this._timelineEl.setup(this._timeline, this.adventurer, {
      isReplay: this.isReplay
    })
  }
}

customElements.define('di-dungeon-page', DungeonPage )