import Timeline from '../../../../../game/timeline.js'
import Page from '../page.js'
import { mergeOptionsObjects, toArray } from '../../../../../game/utilFunctions.js'
import Zones, { floorToZone } from '../../../../../game/zones.js'
import tippy from 'tippy.js'

const HTML = `
<div class='content-rows'>
  <div class='content-columns'>
    <di-combat-fighter-pane class="fighter1"></di-combat-fighter-pane>
    <div class="mid-thing">VS</div>
    <di-combat-fighter-pane class="fighter2"></di-combat-fighter-pane>
  </div>
  <div class="content-columns content-no-grow">
    <div class="content-well">
      <di-combat-feed></di-combat-feed>
    </div>
    <div class="content-well">
      <di-combat-time-controls></di-combat-time-controls>
    </div>
  </div>
</div>
`

export default class CombatPage extends Page{

  _cancelled = false
  _options = {
    isReplay: false,
    returnPage: null
  }

  _timeControlsEl

  constructor(combatID, options = {}){
    super()
    this.innerHTML = HTML
    this.fighterPane1 = this.querySelector('.fighter1')
    this.fighterPane2 = this.querySelector('.fighter2')
    this.combatFeed = this.querySelector('di-combat-feed')
    this._timeControlsEl = this.querySelector('di-combat-time-controls')
    this._timeControlsEl.addEventListener('tick', e => this._tick())
    this._timeControlsEl.addEventListener('jumped', e => this._jump())

    this.querySelector('.permalink').addEventListener('click', e => {
      const txt = `${window.location.origin}/watch/combat/${this.combatID}`
      navigator?.clipboard?.writeText(txt)
      tippy(e.currentTarget, {
        showOnCreate: true,
        content: 'Link copied to clipboard',
        onHidden(instance){
          instance.destroy()
        }
      })
    })

    this.combatID = combatID
    this._options = mergeOptionsObjects(this._options, options)
  }

  get titleText(){
    return 'Fight!'
  }

  async load(previousPage){
    const { combat, state } = await this.fetchData(`/watch/combat/${this.combatID}`)

    // If it's live but the combat's already done, just get outta here
    if(state.status === 'finished' && !this._options.isReplay && this._options.returnPage){
      this.redirectTo(this._options.returnPage)
      return
    }

    const zone = Zones[floorToZone(combat.floor ?? 1)]
    this.app.setBackground(zone.color, zone.texture)

    this.combat = combat
    this.fighterPane1.setFighter(combat.fighter1)
    this.fighterPane2.setFighter(combat.fighter2)
    this._setupTimeline(combat, state)

    // TODO: This only makes sense in monster combat
    this.combatFeed.setText(`A ${combat.fighter2.data.name} draws near.`)
  }

  async unload(){
    this._cancelled = true
  }

  _setupTimeline(combat, state){
    this._timeline = new Timeline(combat.timeline)
    if(!this._options.isReplay){
      this._timeline.time = state.currentTime - this.combat.startTime
    }
    this._timeControlsEl.setup(this._timeline.time, this._timeline.duration, {
      isReplay: this._options.isReplay
    })
    this._applyEntries(this._timeline.currentEntry, false)
    setTimeout(() => {
      this._timeControlsEl.play()
    }, 500)
  }

  _applyEntries(entries, animate = true){

    entries = toArray(entries)

    entries.forEach(entry => {
      entry.actions.forEach(action => {
        this._performAction(action)
      })
      entry.tickUpdates.forEach(tickUpdate => {
        this._performTickUpdate(tickUpdate)
      })
    })

    this._updatePanes(animate)
  }

  _updatePanes(animate){
    const currentEntry = this._timeline.currentEntry
    this._timeline.time = currentEntry.time
    this.fighterPane1.setState(currentEntry.fighterState1, animate)
    this.fighterPane2.setState(currentEntry.fighterState2, animate)
    this.fighterPane1.advanceTime(this._timeline.timeSinceLastEntry)
    this.fighterPane2.advanceTime(this._timeline.timeSinceLastEntry)
  }

  _jump(){
    this._timeline.time = this._timeControlsEl.time
    this._updatePanes(false)
    if(this._timeline.finished){
      this._finish()
    }
  }

  _tick(){
    const prevEntry = this._timeline.currentEntryIndex
    const diff = this._timeControlsEl.time - this._timeline.time
    this._timeline.time += diff
    if(prevEntry !== this._timeline.currentEntryIndex){
      this._applyEntries(this._timeline.entries.slice(prevEntry + 1, this._timeline.currentEntryIndex + 1))
    }else{
      this.fighterPane1.advanceTime(diff)
      this.fighterPane2.advanceTime(diff)
    }
    if(this._timeline.finished){
      this._finish()
    }
  }

  _finish(){

    if(this.combat.fighter1.endState.hp){
      this.combatFeed.setText(`The ${this.combat.fighter2.data.name} has been defeated.`)
    }else if(this.combat.fighter2.endState.hp){
      this.combatFeed.setText(`${this.combat.fighter1.data.name} has been defeated.`)
    }else{
      this.combatFeed.setText('Time is up, combat is not going anywhere.')
    }

    if(this._options.returnPage){
      setTimeout(() => {
        this.redirectTo(this._options.returnPage)
      }, this._options.isReplay ? 1000 : 3000)
    }
  }

  _performAction(action){
    this._getPaneFromFighterId(action.actor).displayActionPerformed(action.ability)
    action.results.forEach(result => {
      this._getPaneFromFighterId(result.subject).displayResult(result)
    })
  }

  _getPaneFromFighterId(fighterId){
    return this.fighterPane1.fighterId === fighterId ? this.fighterPane1 : this.fighterPane2
  }

  _performTickUpdate(tickUpdate){
    this._getPaneFromFighterId(tickUpdate.subject).displayResult(tickUpdate)
  }
}

customElements.define('di-combat-page', CombatPage)