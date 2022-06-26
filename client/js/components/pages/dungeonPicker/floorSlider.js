import { mergeElementOptions } from '../../../../../game/utilFunctions.js'
import ZONES from '../../../../../game/zones.js'

const HTML = `
<div class='flex-rows slider-entries'></div>
`

const ZONE_HTML = name => `
<div class='flex-columns'>
    <div class='flex-rows slider-floors'></div>
    <div class='zone-name'>${name}</div>  
</div>
`

const NOTCH_SVG = type => `
<svg class="notch" viewBox='0 0 20 20'>
    <ellipse cx="10" cy="10" rx="2" ry="2" stroke-width="0"/>
    <line stroke-width="1" x1="10" x2="10" y1="${type === 'first' ? 10: 0}" y2="${type === 'last' ? 10 : 20}"/>
</svg>
`

const FLOOR_HTML = (floor, notchType) => `
${NOTCH_SVG(notchType)}
<span class="floor-number${floor % 10 === 1 ? ' always-show' : ''}">${floor}</span>
`

export default class FloorSlider extends HTMLElement{

  _options = {
    max: 1
  }

  _entriesEl
  _selectedFloorEl
  _floorEls = []

  constructor(){
    super()
    this.innerHTML = HTML
    this._entriesEl = this.querySelector('.slider-entries')

    this.addEventListener('pointerdown', e => {
      this.setPointerCapture(e.pointerId)
      const floor = e.target.closest('.floor')
      if(floor && !floor.classList.contains('selected')){
        this._selectFloor(floor)
      }
    })

    this.addEventListener('pointerup', e => {
      this.releasePointerCapture(e.pointerId)
    })

    this.addEventListener('pointermove', e => {
      if(this.hasPointerCapture(e.pointerId)){
        const floor = document.elementFromPoint(e.clientX, e.clientY)?.closest('.floor')
        if(floor && !floor.classList.contains('selected')){
          this._selectFloor(floor)
        }
      }
    })
  }

  get value(){
    return this._selectedFloorEl?.floorIndex
  }

  setOptions(options){
    this._options = mergeElementOptions(this._options, options)
    this._update()
  }

  _update(){
    this._entriesEl.innerHTML = ''
    const max = this._options.max
    const zones = 1 + Math.floor((max - 1) / 10)
    for(let i = 0; i < zones; i++){
      this._entriesEl.appendChild(this._makeZone(i, max))
    }
    this._selectFloor(this._floorEls.at(-1))
  }

  _makeZone(zoneIndex, maxFloor){
    const zoneEl = document.createElement('div')
    const zone = ZONES[zoneIndex]
    zoneEl.classList.add('zone')
    zoneEl.innerHTML = ZONE_HTML(zone.name)
    zoneEl.style.backgroundColor = zone.color

    const floors = zoneEl.querySelector('.slider-floors')
    for(let i = zoneIndex * 10 + 1; i <= Math.min(maxFloor, 10 * (zoneIndex + 1)); i++){
      const floor = document.createElement('div')
      const notchType = i === 1 ? 'first' : (i === maxFloor ? 'last' : 'middle')
      floor.classList.add('floor', 'flex-columns')
      floor.innerHTML = FLOOR_HTML(i, notchType)
      floor.floorIndex = i
      this._floorEls[i] = floor
      floors.appendChild(floor)
    }

    return zoneEl
  }

  _selectFloor(floorEl){
    if(this._selectedFloorEl){
      this._selectedFloorEl.classList.remove('selected')
    }
    this._selectedFloorEl = floorEl
    floorEl.classList.add('selected')
    requestAnimationFrame(() => {
      floorEl.scrollIntoView()
    })
  }
}

customElements.define('di-floor-slider', FloorSlider)