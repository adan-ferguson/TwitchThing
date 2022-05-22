import tippy from 'tippy.js'
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

  _loadoutItem

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
      if(this.loadoutItem?.details){
        e.preventDefault()
        const modal = new SimpleModal(this.loadoutItem.details)
        modal.show()
      }
    })

    this.addEventListener('pointerenter', e => {
      this._newBadge.classList.add('hidden')
    })
  }

  get loadoutItem(){
    return this._loadoutItem
  }

  showNewBadge(show){
    this._newBadge.classList.toggle('hidden', !show)
  }

  setItem(loadoutItem, enableTooltip = true){
    if(!loadoutItem){
      return this._setupBlank()
    }
    this.classList.remove('blank-row')
    this._loadoutItem = loadoutItem
    this._nameEl.textContent = loadoutItem.name
    this._orbRow.setData(loadoutItem.orbs)

    if(enableTooltip){
      this._tippy.enable()
      this._tippy.setContent(loadoutItem.tooltip)
    }
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this._loadoutItem = null
    this._tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)