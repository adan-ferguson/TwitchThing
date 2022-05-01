import tippy from 'tippy.js'
import Item from '../../../../game/item.js'
import SimpleModal from '../simpleModal.js'
import ItemDetails from '../itemDetails.js'

const HTML = `
<div>
    <span class="icon"></span> <span class="name"></span>
</div>
<di-orb-row></di-orb-row>
<div class="new-badge hidden">New!</div>
`

export default class LoadoutRow extends HTMLElement{

  _iconEl
  _nameEl
  _orbRow
  _newBadge

  _options

  constructor(index = -1, item = null){
    super()
    this.innerHTML = HTML

    this._iconEl = this.querySelector('.icon')
    this._nameEl = this.querySelector('.name')
    this._orbRow = this.querySelector('di-orb-row')
    this._newBadge = this.querySelector('.new-badge')
    this._tippy = tippy(this, {
      theme: 'light',
      allowHTML: true
    })
    this._options = {
      showNewBadge: false
    }
    this._tippy.disable()

    this.index = index
    this.setItem(item)

    this.addEventListener('contextmenu', e => {
      if(this.item){
        e.preventDefault()
        const modal = new SimpleModal(new ItemDetails(this.item))
        modal.show()
      }
    })

    this.addEventListener('pointerenter', e => {
      this._newBadge.classList.add('hidden')
    })
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

  showNewBadge(show){
    this._newBadge.classList.toggle('hidden', !show)
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
      this._tippy.enable()
      this._tippy.setContent(this.itemTooltip)
    }
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.item = null
    this._tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)