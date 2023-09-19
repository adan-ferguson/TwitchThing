import Zones, { floorSize } from '../../../game/zones.js'
import { makeEl, wrapContent } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import AdventurerStatus from './adventurer/adventurerStatus.js'

const HTML = `
<di-tabz>
  <div data-tab-name="Regular" class="runs"></div>
  <div data-tab-name="SUPER" class="runs"></div>
</di-tabz>
`

const ZONE_HTML = ({ name }) => `
<div class="zone-name absolute-center-both">${name}</div>
`

export default class LiveDungeonMap extends HTMLElement{

  _dungeonRunEls = {}

  constructor(){
    super()
    this.innerHTML = HTML
    this._setupRuns(this.regularRunsEl)
    this._setupRuns(this.superRunsEl)
    this._showZones(0)
    this.querySelector('di-tabz').hideTab('SUPER')
  }

  get regularRunsEl(){
    return this.querySelector('.runs[data-tab-name=Regular]')
  }

  get superRunsEl(){
    return this.querySelector('.runs[data-tab-name=SUPER]')
  }

  updateRun(dungeonRun){
    const currentEvent = dungeonRun.currentEvent ?? dungeonRun.newEvents?.at(-1) ?? dungeonRun.events?.at(-1)
    if(!currentEvent){
      return
    }
    if(currentEvent.runFinished){
      return this._runFinished(dungeonRun._id)
    }
    if(!this._dungeonRunEls[dungeonRun._id]){
      this._makeDungeonRunEl(dungeonRun)
    }
    const el = this._dungeonRunEls[dungeonRun._id]
    el._tippyContent.setDungeonRun(dungeonRun)
    el.classList.toggle('in-combat', currentEvent.combatID ? true : false)
    if(el.floor !== dungeonRun.floor){
      el.floor = dungeonRun.floor
      this._getFloorEl(dungeonRun).appendChild(el)
      this._showZones(Math.floor((el.floor - 1) / 10), dungeonRun.dungeonOptions.superDungeon)
    }
    const fs = dungeonRun.room / floorSize(dungeonRun)
    const pct = 95 * Math.min(1, fs)
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
      window.location = `/game/dungeonrun/${_id}`
    })
    this._dungeonRunEls[_id] = el
  }

  _showZones(index, superDungeon = false){
    const runsEl = superDungeon ? this.superRunsEl : this.regularRunsEl
    runsEl.querySelectorAll('.zone').forEach((el, i) => {
      if(i <= index){
        el.classList.remove('displaynone')
      }
    })
    if(superDungeon){
      this.querySelector('di-tabz').unhideTab('SUPER')
    }
  }

  _setupRuns(runsEl){
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
        zoneEl.appendChild(floorEl)
      }
      runsEl.appendChild(zoneEl)
    })
  }

  _getFloorEl(dungeonRun){
    return this._getRunsEl(dungeonRun.dungeonOptions.superDungeon).querySelectorAll('.floor')[dungeonRun.floor - 1]
  }

  _getRunsEl(isSuper){
    return isSuper ? this.superRunsEl : this.regularRunsEl
  }
}

customElements.define('di-live-dungeon-map', LiveDungeonMap)