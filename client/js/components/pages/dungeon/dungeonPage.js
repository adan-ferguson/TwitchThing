import Page from '../page.js'
import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import Zones, { floorToZone, floorToZoneName } from '../../../../../game/zones.js'
import Timeline from '../../../../../game/timeline.js'
import fizzetch from '../../../fizzetch.js'
import FighterInstancePane from '../../combat/fighterInstancePane.js'
import CombatEnactment from '../../../combatEnactment.js'
import EventContentsResults from './eventContentsResults.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import AdventurerInstance from '../../../../../game/adventurerInstance.js'
import { hideAll } from 'tippy.js'
import { hideLoader, showLoader } from '../../../loader.js'
import SimpleModal from '../../simpleModal.js'
import { roundToFixed, wrapContent } from '../../../../../game/utilFunctions.js'
import { decompress } from 'compress-json'

const ALWAYS_LOAD_LARGE_RUNS_KEY = 'always-load-large-runs'
const ESTIMATED_SIZE_PER_MS = 0.25 // About 15kb per minute
const LARGE_RUN_THRESHOLD_MS = 1000 * 60 * 60
const LARGE_RUN_MODAL_HTML = estSize => `
<p>
  Download data for this large run? Estimated size: ${estSize}.
</p>
<label>
  <input type='checkbox' class='dont-ask'/> Don't ask me again
</label>
`

const HTML = `
<div class="content-rows">
  <di-top-thing></di-top-thing>
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
</div>
`

export default class DungeonPage extends Page{

  _dungeonRunID

  _adventurerPane
  _eventEl
  _stateEl
  _timelineEl

  _timeline

  _cachedCombats = {}

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
    if(!this.app.user || !this.adventurerDoc){
      return false
    }
    return this.app.user._id === this.adventurerDoc.userID
  }

  get watching(){
    return this.dungeonRun.finalized || !this.isMyAdventurer
  }

  get titleText(){
    return this.currentEvent ? floorToZoneName(this.currentEvent?.floor) : 'Exploring'
  }

  get currentEvent(){
    return this._timeline.currentEntry
  }

  get adventurerDoc(){
    return this.dungeonRun.adventurer
  }

  get adventurerInstance(){
    return new AdventurerInstance(this.adventurerDoc, this.currentEvent?.adventurerState ?? {})
  }

  get isReplay(){
    return this.dungeonRun.finished ? true : false
  }

  get topThingEl(){
    return this.querySelector('di-top-thing')
  }

  async load(){

    const { dungeonRun } = await this.fetchData()

    this.dungeonRun = dungeonRun

    if(!this.isReplay){
      joinSocketRoom(this.dungeonRun._id)
      getSocket().on('dungeon run update', this._socketUpdate)
    }

    this._stateEl.setup(dungeonRun, this.app.user)
    this._setupTimeline(dungeonRun)
    this._adventurerPane.setFighter(new AdventurerInstance(this.adventurerDoc, dungeonRun.adventurerState))
    this._eventEl.setup(this.adventurerDoc, this._timeline)
    this._update({ animate: false })
  }

  async unload(){
    if(!this.isReplay){
      leaveSocketRoom(this.dungeonRun._id)
      getSocket().off('dungeon run update', this._socketUpdate)
    }
    this._timelineEl.destroy()
  }

  _socketUpdate = ({ id, error, combatUpdate, dungeonRun }) => {

    if(this.dungeonRun._id !== id){
      return
    }

    if(error){
      return this.app.showError(error)
    }

    if(combatUpdate){
      return this._combatLoaded(combatUpdate)
    }

    this.dungeonRun = dungeonRun
    this._timelineEl.addEvents(dungeonRun.newEvents)

    if(dungeonRun.newEvents){
      dungeonRun.newEvents.forEach(ev => this._loadCombat(ev.combatID))
    }

    if(dungeonRun.finished){
      this._timelineEl.setOptions({
        isReplay: true
      })
    }

    if(dungeonRun.virtualTime){
      this._timelineEl.jumpTo(dungeonRun.virtualTime, {
        force: dungeonRun.finished ? true : false
      })
    }

    this._timelineEl.play()
  }

  async _update(options = {}){

    options = {
      animate: true,
      ...options
    }

    hideAll()

    const animate = options.animate

    if(this.currentEvent && !this.isReplay){
      setTimeout(() => {
        this._timelineEl.play()
      })
    }

    this._updateBackground()
    this._stateEl.update(this.currentEvent, this.dungeonRun, this.adventurerInstance, animate)

    if(this.isReplay && this._timeline.finished){
      this._showResults()
      this._ce?.destroy()
      return
    }

    this._adventurerPane.classList.remove('displaynone')
    this._adventurerResultsPane.classList.add('displaynone')

    if(this.currentEvent.roomType === 'combat'){
      this._enactCombat(animate)
    }else{
      this.topThingEl.updateEvent(this.currentEvent)
      this._eventEl.update(this.currentEvent, animate)
      this._adventurerPane.setState(this.currentEvent.adventurerState ?? {}, !animate)
      this._ce?.destroy()
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
    this.topThingEl.update('Results')
    this._eventEl.setContents(results, true)
    this._timelineEl.pause()
    this._adventurerResultsPane.classList.remove('displaynone')
    this._adventurerPane.classList.add('displaynone')
    if(this.isMyAdventurer){
      results.showFinalizerButton(async () => {
        await fizzetch(`/game/dungeonrun/${this._dungeonRunID}/finalize`)
        this.redirectTo(AdventurerPage.path(this.adventurerDoc._id))
      })
    }
    results.play(this.dungeonRun, this._adventurerResultsPane, this.watching)
  }

  async _enactCombat(animate){
    if(this._ce){
      if(this._ce.combatID === this.currentEvent.combatID){
        this._ce.timeline.setTime(this._timeline.timeSinceLastEntry - (this.currentEvent.refereeTime ?? 0), true)
        return
      }else{
        this._ce?.destroy()
      }
    }

    const combat = await this._getCombat(this.currentEvent.combatID)
    const enemyPane = new FighterInstancePane()
    this._eventEl.setContents(enemyPane, animate)
    const ce = new CombatEnactment(this._adventurerPane, enemyPane, this.topThingEl)
    if(combat.timeline){
      ce.setCombat(combat)
      ce.timeline.setTime(this._timeline.timeSinceLastEntry - (this.currentEvent.refereeTime ?? 0), true)
    }else{
      ce.setPendingCombat(this.currentEvent)
    }
    ce.on('destroyed', () => {
      this._ce = null
    })
    this._ce = ce
  }

  _combatLoaded({ combatDoc, newCombatEvent }){
    this._timelineEl.updateEvent(newCombatEvent)
    this._cachedCombats[combatDoc._id] = combatDoc
    if(this._ce?.combatID === combatDoc._id){
      this._ce.setCombat(combatDoc)
      this._ce.timeline.setTime(this._timeline.timeSinceLastEntry - (this.currentEvent.refereeTime ?? 0), true)
    }
  }

  _timeChange({ before, after, jumped }){
    if(!this.currentEvent){
      return
    }
    if(this._ce && this.currentEvent.roomType === 'combat'){
      const time = this._timeline.timeSinceLastEntry - (this.currentEvent.refereeTime ?? 0)
      this._ce.timeline?.setTime(time, jumped)
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
    this.app.updateTitle()
  }

  _setupTimeline(dungeonRun){
    const targetTime = dungeonRun.virtualTime ?? dungeonRun.elapsedTime
    this._timeline = new Timeline(dungeonRun.events, targetTime)
    this._timeline.on('timechange', obj => {
      this._timeChange(obj)
    })
    this._timelineEl.setup(this._timeline, dungeonRun, {
      isReplay: this.isReplay,
      loadEvents: async () => {
        await this._loadEvents()
      }
    })
  }

  async _getCombat(combatID){
    if(!this._cachedCombats[combatID]){
      await this._loadCombat(combatID)
    }
    return this._cachedCombats[combatID]
  }

  async _loadCombat(combatID){
    if(!combatID || this._cachedCombats[combatID]){
      return
    }
    const result = await fizzetch(`/game/combat/${combatID}`)
    this._cachedCombats[combatID] = result.combat
  }

  async _loadEvents(){
    if(this._fullLoaded){
      return
    }
    // FIXME: remove this? we don't load everything anymore anyway
    const isLarge = false // this.dungeonRun.elapsedTime > LARGE_RUN_THRESHOLD_MS
    if(isLarge && !localStorage.getItem(ALWAYS_LOAD_LARGE_RUNS_KEY)){
      const estSize = roundToFixed(ESTIMATED_SIZE_PER_MS * this.dungeonRun.elapsedTime / 1000000, 2)
      const content = wrapContent(LARGE_RUN_MODAL_HTML(estSize + 'mb'))
      const modal = new SimpleModal(content, [{
        text: 'Yes',
        style: 'good',
        value: true,
      },{
        text: 'No',
        value: false,
      }]).show()
      const result = await modal.awaitResult()
      if(!result){
        throw 'Lazy'
      }
      if(modal.querySelector('.dont-ask').checked){
        localStorage.setItem(ALWAYS_LOAD_LARGE_RUNS_KEY, true)
      }
    }
    showLoader()
    const { combats, events, compressed } = await fizzetch(`/game/dungeonrun/${this._dungeonRunID}/loadfull`)
    this._cachedCombats = compressed ? decompress(combats) : combats
    this._timeline.entries = compressed ? decompress(events) : events
    this._fullLoaded = true
    hideLoader()
  }
}

customElements.define('di-dungeon-page', DungeonPage )