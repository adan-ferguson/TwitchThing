import Timeline from '../../../../../game/timeline.js'
import Page from '../page.js'
import { toArray } from '../../../../../game/utilFunctions.js'
import Zones, { floorToZone } from '../../../../../game/zones.js'
import { toFighterInstance } from '../../../../../game/toFighterInstance.js'

const HTML = `
<div class='content-rows'>
  <div class='content-columns'>
    <di-fighter-instance-pane class="fighter1"></di-fighter-instance-pane>
    <div class="mid-thing"><span>VS</span></div>
    <di-fighter-instance-pane class="fighter2"></di-fighter-instance-pane>
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

  _combatFeedEl
  _timeControlsEl
  _fighterPane1
  _fighterPane2

  _combatID
  _cancelled = false

  constructor(combatID){
    super()
    this.innerHTML = HTML
    this._fighterPane1 = this.querySelector('.fighter1')
    this._fighterPane2 = this.querySelector('.fighter2')
    this._combatFeedEl = this.querySelector('di-combat-feed')
    this._timeControlsEl = this.querySelector('di-combat-time-controls')
    this._timeControlsEl.addEventListener('tick', e => this._tick())
    this._timeControlsEl.addEventListener('jumped', e => this._jump())

    // this.querySelector('.permalink').addEventListener('click', e => {
    //   const txt = `${window.location.origin}/combat/${combatID}`
    //   navigator?.clipboard?.writeText(txt)
    //   console.log('Copied', txt, navigator?.clipboard ? true : false)
    //   tippy(e.currentTarget, {
    //     showOnCreate: true,
    //     content: 'Link copied to clipboard',
    //     onHidden(instance){
    //       instance.destroy()
    //     }
    //   })
    // })

    this._combatID = combatID
  }

  static get pathDef(){
    return ['combat', 0]
  }

  get pathArgs(){
    return [this._combatID]
  }

  get titleText(){
    return 'Fight!'
  }

  async load(){

    const { combat } = await this.fetchData()

    const zone = Zones[floorToZone(combat.floor ?? 1)]
    if(zone){
      this.app.setBackground(zone.color, zone.texture)
    }

    this.combat = combat

    const fighterInstance1 = toFighterInstance(combat.fighter1.data, combat.fighter1.startState)
    const fighterInstance2 = toFighterInstance(combat.fighter2.data, combat.fighter2.startState)
    this._fighterPane1.setFighter(fighterInstance1)
    this._fighterPane2.setFighter(fighterInstance2)
    this._setupTimeline(combat)

    // TODO: This only makes sense in monster combat
    // this.combatFeed.setText(`A ${toDisplayName(combat.fighter2.data.name)} draws near.`)
  }

  async unload(){
    this._timeControlsEl.pause()
    this._cancelled = true
  }

  _setupTimeline(combat){
    this._timeline = new Timeline(combat.timeline)
    this._timeControlsEl.setup(this._timeline.time, this._timeline.duration)
    this._applyEntries(this._timeline.currentEntry, false)
    this._timeControlsEl.play()
  }

  _applyEntries(entries, animate = true){
    if(this._cancelled){
      return
    }

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
    if(this._cancelled){
      return
    }
    const currentEntry = this._timeline.currentEntry
    this._timeline.time = currentEntry.time
    this._fighterPane1.setState(currentEntry.fighterState1, animate)
    this._fighterPane2.setState(currentEntry.fighterState2, animate)
    this._fighterPane1.advanceTime(this._timeline.timeSinceLastEntry)
    this._fighterPane2.advanceTime(this._timeline.timeSinceLastEntry)
  }

  _jump(){
    this._timeline.time = this._timeControlsEl.time
    this._updatePanes(false)
    if(this._timeline.finished){
      this._finish()
    }
  }

  _tick(){
    if(this._cancelled){
      return
    }
    const prevEntry = this._timeline.currentEntryIndex
    const diff = this._timeControlsEl.time - this._timeline.time
    this._timeline.time += diff
    if(prevEntry !== this._timeline.currentEntryIndex){
      this._applyEntries(this._timeline.entries.slice(prevEntry + 1, this._timeline.currentEntryIndex + 1))
    }else{
      this._fighterPane1.advanceTime(diff)
      this._fighterPane2.advanceTime(diff)
    }
    if(this._timeline.finished){
      this._finish()
    }
  }

  _finish(){
    const fighter1 = this._fighterPane1.fighterInstance
    const fighter2 = this._fighterPane2.fighterInstance
    if(fighter2.hp <= 0){
      this._combatFeedEl.setText(`${fighter2.displayName} has been defeated.`)
    }else if(fighter1.hp <= 0){
      this._combatFeedEl.setText(`${fighter1.displayName} has been defeated.`)
    }else{
      this._combatFeedEl.setText('Time is up, combat is not going anywhere.')
    }
  }

  _performAction(action){
    this._getPaneFromFighterId(action.actor).displayActionPerformed(action.ability)
    action.results.forEach(result => {
      this._getPaneFromFighterId(result.subject).displayResult(result)
    })
  }

  _getPaneFromFighterId(fighterId){
    return this._fighterPane1.fighterId === fighterId ? this._fighterPane1 : this._fighterPane2
  }

  _performTickUpdate(tickUpdate){
    this._getPaneFromFighterId(tickUpdate.subject).displayResult(tickUpdate)
  }
}

customElements.define('di-combat-page', CombatPage)