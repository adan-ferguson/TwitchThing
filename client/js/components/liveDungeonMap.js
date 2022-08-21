import fizzetch from '../fizzetch.js'
import { getSocket } from '../socketClient.js'
import Zones from '../../../game/zones.js'
import { makeEl, wait, wrap } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import AdventurerStatus from './adventurerStatus.js'

const HTML = `
<div class="flex-no-grow heading">Live Dungeon Runs</div>
<div class="runs">
  <di-loader class="show"></di-loader>
</div>
`

const ZONE_HTML = ({ name }) => `
<div class="zone-name absolute-center-both">${name}</div>
`

export default class LiveDungeonMap extends HTMLElement{

  _floorEls = []
  _dungeonRunEls = {}

  constructor(){
    super()
    this.innerHTML = HTML
  }

  async load(){
    const { activeRuns } = await fizzetch('/watch/livedungeonmap')
    await wait(200)
    const runsEl = this.querySelector('.runs')
    runsEl.innerHTML = ''

    Zones.forEach((zone, zoneIndex) => {
      const zoneEl = wrap(ZONE_HTML(zone), {
        class: 'zone',
        allowHTML: true
      })
      zoneEl.classList.add('displaynone')
      zoneEl.style.backgroundColor = zone.color
      zoneEl.style.backgroundImage = `url("/assets/textures/${zone.texture}")`
      for(let i = 0; i < 10; i++){
        const floorEl = makeEl({ class: 'floor' })
        this._floorEls[i + 10 * zoneIndex] = floorEl
        zoneEl.appendChild(floorEl)
      }
      runsEl.appendChild(zoneEl)
    })
    this._showZones(0)

    activeRuns.forEach(this._updateRun)
    getSocket().on('live dungeon map update', this._updateRun)
  }

  unload(){
    getSocket().off('live dungeon map update', this._updateRun)
  }

  _updateRun = dungeonRun => {
    console.log('updating an el')
    if(!this._dungeonRunEls[dungeonRun._id]){
      this._makeDungeonRunEl(dungeonRun)
    }
    const el = this._dungeonRunEls[dungeonRun._id]
    el._tippyContent.setDungeonRun(dungeonRun)
    el.classList.toggle('in-combat', dungeonRun.combatID ? true : false)
    if(el.floor !== dungeonRun.floor){
      el.floor = dungeonRun.floor
      this._floorEls[dungeonRun.floor - 1].appendChild(el)
      this._showZones(Math.floor((el.floor - 1) / 10))
    }
  }

  _makeDungeonRunEl({ _id, adventurer }){
    const el = makeEl({ class: 'dungeon-run-dot' })
    const status = new AdventurerStatus(adventurer)
    el._tippyContent = status
    tippy(el, {
      theme: 'light',
      allowHTML: true,
      content: status
    })
    el.addEventListener('click', () => {
      window.open(`/watch/dungeonrun/${_id}`, '_blank')
    })
    this._dungeonRunEls[_id] = el
  }

  _showZones(index){
    this.querySelectorAll('.zone').forEach((el, i) => {
      if(i <= index){
        el.classList.remove('displaynone')
      }
    })
  }
}

customElements.define('di-live-dungeon-map', LiveDungeonMap)