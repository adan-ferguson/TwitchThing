import tippy from 'tippy.js'

const HTML = `
<div>
    <span class="icon"></span> <span class="name"></span>
</div>
<di-orb-row></di-orb-row>
`

export default class LoadoutRow extends HTMLElement{

  _iconEl
  _nameEl
  _orbRow

  constructor(index = -1, item = null){
    super()
    this.innerHTML = HTML
    this._iconEl = this.querySelector('.icon')
    this._nameEl = this.querySelector('.name')
    this._orbRow = this.querySelector('di-orb-row')
    this.tippy = tippy(this)
    this.index = index
    this.setItem(item)
  }

  get itemTooltip(){
    if(!this.item){
      return ''
    }
    return JSON.stringify(this.item.stats)
  }

  setItem(item){
    if(!item){
      return this._setupBlank()
    }
    this.classList.remove('blank-row')
    this.item = item
    this._nameEl.textContent = this.item.name
    this._orbRow.setValue(item.orbs)
    this.tippy.enable()
    this.tippy.setContent(() => this.itemTooltip)
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.item = null
    this.tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)