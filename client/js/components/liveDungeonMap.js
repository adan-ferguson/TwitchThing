import Zones, { floorSize } from '../../../game/zones.js'
import { makeEl, wrapContent } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import AdventurerStatus from './adventurer/adventurerStatus.js'

const HTML = `
<div class="runs"></div>
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
    const runsEl = this.querySelector('.runs')
    Zones.forEach((zone, zoneIndex) => {
      const zoneEl = wrapContent(ZONE_HTML(zone), {
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
  }

  updateRun(dungeonRun){
    if(dungeonRun.currentEvent.runFinished){
      return this._runFinished(dungeonRun._id)
    }
    if(!this._dungeonRunEls[dungeonRun._id]){
      this._makeDungeonRunEl(dungeonRun)
    }
    const el = this._dungeonRunEls[dungeonRun._id]
    el._tippyContent.setDungeonRun(dungeonRun)
    el.classList.toggle('in-combat', dungeonRun.currentEvent.combatID ? true : false)
    if(el.floor !== dungeonRun.floor){
      el.floor = dungeonRun.floor
      this._floorEls[dungeonRun.floor - 1].appendChild(el)
      this._showZones(Math.floor((el.floor - 1) / 10))
    }
    const pct = 95 * Math.min(1, dungeonRun.room / floorSize(dungeonRun.floor))
    el.style.left = `${pct}%`
  }

  _runFinished(id){
    const el = this._dungeonRunEls[id]
    if(!el){
      return
    }
    el.remove()
    delete this._dungeonRunEls[id]
  }

  _makeDungeonRunEl({ _id, adventurer }){
    const el = makeEl({ class: ['dungeon-run-dot', 'clickable'] })
    const status = new AdventurerStatus(adventurer)
    status.appendChild(wrapContent('Click to watch', {
      class: 'subtitle',
      elementType: 'span'
    }))
    el._tippyContent = status
    tippy(el, {
      theme: 'light',
      allowHTML: true,
      content: status
    })
    el.addEventListener('click', () => {
      window.open(`/dungeonrun/${_id}`, '_blank')
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