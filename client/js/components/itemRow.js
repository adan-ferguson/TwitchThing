import { OrbsDisplayStyle } from './orbRow.js'

const HTML = `
<div class="flex-columns-center">
  <div class="count-tab displaynone"></div>
  <span class="name"></span>
</div>
<div class="flex-columns-center">
  <di-orb-row></di-orb-row>
</div>
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

  setItem(loadoutItem = {}){
    this._nameEl.textContent = loadoutItem?.displayName
    this._orbRow.setData(loadoutItem?.orbs)
  }

  setCount(count){
    const countEl = this.querySelector('.count-tab')
    countEl.classList.toggle('displaynone', count > 1 ? false : true)
    countEl.textContent = 'x' + count
  }
}

customElements.define('di-item-row', ItemRow)