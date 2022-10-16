import tippy from 'tippy.js'
import SimpleModal from '../simpleModal.js'
import { wrapContent } from '../../../../game/utilFunctions.js'

const HTML = `
<di-bar class="cooldown"></di-bar>
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
    this._cooldownBarEl = this.querySelector('di-bar.cooldown')
      .setOptions({
        showLabel: false,
        showValue: false
      })
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

    tooltip.appendChild(this.loadoutItem.makeTooltip())

    if(this.loadoutItem.makeDetails){
      tooltip.appendChild(wrapContent('Right-click for more info', {
        class: 'right-click subtitle'
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
    this._itemRowEl.setItem(loadoutItem)
    this._tippy.enable()
    this._tippy.setContent(this.tooltip)
  }

  update(){

    this.classList.toggle('disabled', this.loadoutItem?.obj?.failsConditions)

    const state = this.loadoutItem?.abilityState
    if(!state){
      return
    }

    let attrVal
    if(state.type === 'active'){
      attrVal = (state.ability.ready && state.ability.meetsConditions) ? 'active' : 'recharging'
    }else{
      attrVal = state.ability.ready ? 'triggered' : 'recharging'
    }
    this.setAttribute('ability', attrVal)

    if(state.ability.cooldown){
      this._cooldownBarEl
        .setOptions({
          max: state.ability.cooldown
        })
        .setValue(state.ability.cooldown - state.ability.cooldownRemaining)
    }else if(state.ability.uses){
      this._cooldownBarEl
        .setOptions({
          max: state.ability.uses
        })
        .setValue(state.ability.uses - state.ability.timesUsed)
    }
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.loadoutItem = null
    this._itemRowEl.setItem(null)
    this._tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)