import Page from '../page.js'
import Zones, { floorToZone } from '../../../../../game/zones.js'
import CombatEnactment from '../../../combatEnactment.js'

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

  get timeline(){
    return this._ce.timeline
  }

  async load(){

    const { combat } = await this.fetchData()

    const zone = Zones[floorToZone(combat.floor ?? 1)]
    if(zone){
      this.app.setBackground(zone.color, zone.texture)
    }

    this._ce = new CombatEnactment(this._fighterPane1, this._fighterPane2, combat)
    this._timeControlsEl.setup(this.timeline.time, this.timeline.duration)
    this.timeline.play()
  }

  async unload(){
    this._timeControlsEl.pause()
    this._ce.destroy()
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
    this._timeline.time += this._timeControlsEl.time - this._timeline.time
    if(this._timeline.finished){
      this._finish()
    }
  }

  _finish(){
    const fighter1 = this._ce.fighterInstance1
    const fighter2 = this._ce.fighterInstance2
    if(fighter2.hp <= 0){
      this._combatFeedEl.setText(`${fighter2.displayName} has been defeated.`)
    }else if(fighter1.hp <= 0){
      this._combatFeedEl.setText(`${fighter1.displayName} has been defeated.`)
    }else{
      this._combatFeedEl.setText('Time is up, combat is not going anywhere.')
    }
  }
}

customElements.define('di-combat-page', CombatPage)