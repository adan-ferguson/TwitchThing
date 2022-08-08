import tippy from 'tippy.js'
import SimpleModal from '../simpleModal.js'
import { wrap } from '../../../../game/utilFunctions.js'

const HTML = `
<di-item-row></di-item-row>
<div class="new-badge hidden">New!</div>
`

export default class LoadoutRow extends HTMLElement{

  _newBadge
  _options

  loadoutItem

  constructor(index = -1){
    super()
    this.innerHTML = HTML
    this._newBadge = this.querySelector('.new-badge')
    this._itemRowEl = this.querySelector('di-item-row')
    this._tippy = tippy(this, {
      theme: 'light',
      allowHTML: true
    })
    this._options = {
      showNewBadge: false
    }
    this._tippy.disable()
    this.index = index
    this.setItem(null)
    this.addEventListener('contextmenu', e => {
      if(this.loadoutItem?.makeDetails){
        e.preventDefault()
        const modal = new SimpleModal(this.loadoutItem.makeDetails())
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

  setItem(loadoutItem){
    if(!loadoutItem){
      return this._setupBlank()
    }
    this.classList.remove('blank-row')
    this.loadoutItem = loadoutItem
    this._itemRowEl.setItem(loadoutItem.obj)
    this._tippy.enable()
    this._tippy.setContent(this.tooltip)
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.loadoutItem = null
    this._tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)