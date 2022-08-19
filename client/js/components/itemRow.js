import { OrbsDisplayStyle } from './orbRow.js'

const HTML = `
<div>
    <span class="icon"></span> <span class="name"></span>
</div>
<di-orb-row></di-orb-row>
`

export default class ItemRow extends HTMLElement{

  _iconEl
  _nameEl
  _orbRow

  constructor(){
    super()
    this.innerHTML = HTML
    this._iconEl = this.querySelector('.icon')
    this._nameEl = this.querySelector('.name')
    this._orbRow = this.querySelector('di-orb-row')
    this._orbRow.setOptions({
      style: OrbsDisplayStyle.MAX_ONLY,
      showTooltips: false
    })
  }

  setItem(loadoutItem){
    this._nameEl.textContent = loadoutItem.name
    this._orbRow.setData(loadoutItem.orbs)
  }
}

customElements.define('di-item-row', ItemRow)