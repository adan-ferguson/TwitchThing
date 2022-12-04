import tippy from 'tippy.js'
import SimpleModal from '../simpleModal.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import { ITEM_ROW_COLORS } from '../../colors.js'
import EffectDetails from '../effectDetails.js'
import DIElement from '../diElement.js'

const HTML = `
<di-bar class="cooldown"></di-bar>
<di-item-row></di-item-row>
<div class="new-badge hidden">New!</div>
<div class="hit-area"></div>
<div class="count-tab displaynone"></div>
`

export default class LoadoutRow extends DIElement{

  _newBadge
  _usesCooldown
  _count = 1

  _options = {
    showCount: false
  }

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

    const tooltip = document.createElement('div')

    if(!this.loadoutItem?.obj){
      return tooltip
    }

    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(
      new EffectDetails().setEffect(this.loadoutItem.obj)
    )
    tooltip.appendChild(wrapContent('Right-click for more info', {
      class: 'right-click subtitle'
    }))

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
    this.updateTooltip()
    return this
  }

  setCount(count){
    // TODO: fix this
    this._options.showCount = true
    this._count = count
    const countEl = this.querySelector('.count-tab')
    countEl.classList.toggle('displaynone', !this._options.showCount)
    countEl.textContent = count + 'x'
    return this
  }

  updateTooltip(){
    this._tippy.setContent(this.tooltip)
  }

  updateItemRow(){
    this._itemRowEl.setItem(this.loadoutItem)
  }

  update(){

    this._cooldownBarEl.style.visibility = this.loadoutItem ? 'visible' : 'hidden'

    const info = this.loadoutItem?.abilityDisplayInfo
    if(!info || info.idle){
      return
    }

    const disabled = this.loadoutItem.itemInstance.disabled  // || info.state === AbilityState.DISABLED
    this.classList.toggle('disabled', disabled)
    this.setAttribute('ability-type', info.type)
    this.setAttribute('ability-state', info.state)

    // info.state === AbilityState.DISABLED ? 'disabled' :
    const color = ITEM_ROW_COLORS[info.type]
    const borderColor = info.state === 'ready' ? color : ITEM_ROW_COLORS.disabled

    this._cooldownBarEl
      .setOptions({
        color,
        borderColor,
        max: info.barMax
      })
      .setValue(info.barValue)

    this._usesCooldown = info.ability.cooldown ? true : false
  }

  advanceTime(ms){
    if(this._usesCooldown){
      this._cooldownBarEl.setValue(ms, { relative: true })
    }
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.loadoutItem = null
    this._itemRowEl.setItem(null)
    this._tippy.disable()
    return this
  }
}

customElements.define('di-loadout-row', LoadoutRow)