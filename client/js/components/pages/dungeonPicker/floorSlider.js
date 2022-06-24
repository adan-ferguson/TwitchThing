import { mergeElementOptions } from '../../../../../game/utilFunctions.js'
import ZONES from '../../../../../game/zones.js'

const HTML = `
<div class='flex-rows slider-entries'></div>
`

const ZONE_HTML = zoneName => `
<div class='flex-columns'>
    <div class='flex-rows slider-floors'></div>
    <div class='zone-name'>${zoneName}</div>  
</div>
`

const FLOOR_HTML = floor => `
<span class="notch"></span>
<span class="floor-number">${floor}</span>
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
    const zones = 1 + Math.floor(this._options.max - 1)
    for(let i = 0; i < zones; i++){
      this._entriesEl.appendChild(this._makeZone(i, this._options.max))
    }
    this._selectFloor(this._options.max)
  }

  _makeZone(zoneIndex, maxFloor){
    const zoneEl = document.createElement('div')
    zoneEl.innerHTML = ZONE_HTML(ZONES[zoneIndex])

    const floors = zoneEl.querySelector('.slider-floors')
    for(let i = zoneIndex * 10; i <= maxFloor; i++){
      const floor = document.createElement('div')
      floor.innerHTML = FLOOR_HTML(i)
      floor.floorIndex = i
      floor.classList.toggle('first', i === 1)
      floor.classList.toggle('last', i === maxFloor)
      this._floorEls[i] = floor
      floors.appendChild(floor)
    }

    return zoneEl
  }

  _selectFloor(val){
    if(!this._floorEls[val]){
      return
    }
    if(this._selectedFloorEl){
      this._selectedFloorEl.classList.remove('selected')
    }
    this._selectedFloorEl = this._floorEls[val]
    this._selectedFloorEl.classList.add('selected')
  }
}

customElements.define('di-floor-slider', FloorSlider)