import tippy from 'tippy.js'
import Item from '../../../../game/item.js'

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
    this.tippy = tippy(this, {
      theme: 'light',
      allowHTML: true,
      onShown: () => {
      }
    })
    this.tippy.disable()
    this.index = index
    this.setItem(item)
  }

  get itemTooltip(){
    if(!this.item){
      return ''
    }
    const tooltip = document.createElement('div')
    tooltip.innerHTML = this.item.HTML

    const right = document.createElement('div')
    right.classList.add('right-click')
    right.innerHTML = 'right-click for more info'
    tooltip.appendChild(right)
    return tooltip
  }

  setItem(item, enableTooltip = true){
    if(!item){
      return this._setupBlank()
    }
    item = new Item(item)
    this.classList.remove('blank-row')
    this.item = item
    this._nameEl.textContent = this.item.name
    this._orbRow.setValue(item.orbs)

    if(enableTooltip){
      this.tippy.enable()
      this.tippy.setContent(this.itemTooltip)
    }
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.item = null
    this.tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)