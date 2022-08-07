import tippy from 'tippy.js'
import SimpleModal from '../simpleModal.js'
import { OrbsDisplayStyle } from '../orbRow.js'
import { wrap } from '../../../../game/utilFunctions.js'

const HTML = `
<di-item-details></di-item-details>
`

export default class LoadoutRow extends HTMLElement{

  _iconEl
  _nameEl
  _orbRow
  _newBadge
  _options

  loadoutItem

  constructor(index = -1, item = null){
    super()
    this.innerHTML = HTML

    this._iconEl = this.querySelector('.icon')
    this._nameEl = this.querySelector('.name')
    this._orbRow = this.querySelector('di-orb-row')
    this._orbRow.setOptions({
      style: OrbsDisplayStyle.MAX_ONLY,
      showTooltips: false
    })
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

  get tooltip(){

    if(!this.loadoutItem?.makeTooltip){
      return ''
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')

    tooltip.appendChild(wrap(this.loadoutItem.makeTooltip(true), {
      class: 'tooltip-content',
      allowHTML: true
    }))

    if(this.loadoutItem.makeDetails){
      tooltip.appendChild(wrap('Right-click for more info', {
        class: 'right-click'
      }))
    }

    return tooltip
  }

  showNewBadge(show){
    this._newBadge.classList.toggle('hidden', !show)
  }

  setItem(loadoutItem, enableTooltip = true){
    if(!loadoutItem){
      return this._setupBlank()
    }
    this.classList.remove('blank-row')
    this.loadoutItem = loadoutItem
    this._nameEl.textContent = loadoutItem.name
    this._orbRow.setData(loadoutItem.orbs)

    if(enableTooltip){
      this._tippy.enable()
      this._tippy.setContent(this.tooltip)
    }
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.loadoutItem = null
    this._tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)