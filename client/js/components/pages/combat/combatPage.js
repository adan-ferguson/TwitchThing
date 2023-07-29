import Page from '../page.js'
import Zones, { floorToZone } from '../../../../../game/zones.js'
import CombatEnactment from '../../../combatEnactment.js'

const HTML = `
<div class='content-rows'>
  <di-top-thing></di-top-thing>
  <div class='content-columns'>
    <div class="content-well fill-contents">
      <di-fighter-instance-pane class="fighter1"></di-fighter-instance-pane>
    </div>
    <div class="content-well fill-contents">
      <di-fighter-instance-pane class="fighter2"></di-fighter-instance-pane>
    </div>
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
    this._timeControlsEl.events.on('timechange', ({ jumped }) => {
      this.timeline.setTime(this._timeControlsEl.time, jumped)
    })
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

    this._ce = new CombatEnactment(this._fighterPane1, this._fighterPane2, this.querySelector('di-top-thing'))
    this._ce.setCombat(combat)
    this._timeControlsEl.setup(this.timeline.time, this.timeline.duration)

    setTimeout(() => {
      this._timeControlsEl.play()
    }, 100)

    this.querySelector('button.diagnose').addEventListener('click', () => {
      window.location = '/game/admin/combatperf/' + combat._id
    })
  }

  async unload(){
    this._timeControlsEl.pause()
    this._ce.destroy()
  }
}

customElements.define('di-combat-page', CombatPage)