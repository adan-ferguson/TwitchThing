import tippy from 'tippy.js'
import SimpleModal from '../../simpleModal.js'
import { wrapContent } from '../../../../../game/utilFunctions.js'
import { ITEM_ROW_COLORS } from '../../../colors.js'
import EffectDetails from '../../effectDetails.js'
import DIElement from '../../diElement.js'
import ItemCard from '../../itemCard.js'
import ItemDetails from '../../itemDetails.js'
import { AbilityState } from '../../../abilityDisplayInfo.js'

const HTML = `
<di-bar class="cooldown"></di-bar>
<di-item-row></di-item-row>
<div class="new-badge hidden">New!</div>
<div class="hit-area"></div>
`

export default class LoadoutRow extends DIElement{

  _newBadge
  _usesCooldown
  _count = 1

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
      if(this.loadoutItem){
        e.preventDefault()
        const details = new ItemDetails().setItem(this.loadoutItem.obj).setOptions({
          showUpgradeButton: true
        })
        const modal = new SimpleModal(details)
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

  get count(){
    return this._count
  }

  set count(val){
    this._count = val
    this._itemRowEl.setCount(val)
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
    this.update()
    return this
  }

  setCount(count){
    this.count = count
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
    if(!info || info.type === 'triggered' && !info.cooldownRefreshing){
      this.classList.remove('disabled')
      this.removeAttribute('ability-type')
      this.removeAttribute('ability-state')
      this._cooldownBarEl
        .setOptions({
          color: null,
          borderColor: '#DDD',
          max: 1
        })
        .setValue(0)
      return
    }

    const disabled = this.loadoutItem.itemInstance.disabled  // || info.state === AbilityState.DISABLED
    this.classList.toggle('disabled', disabled)
    this.setAttribute('ability-type', info.type)
    this.setAttribute('ability-state', info.state)

    // info.state === AbilityState.DISABLED ? 'disabled' :
    const color = ITEM_ROW_COLORS[info.type]
    const borderColor = color // info.state === 'ready' ? color : ITEM_ROW_COLORS.disabled

    this._cooldownBarEl
      .setOptions({
        color,
        borderColor,
        max: info.barMax
      })
      .setValue(info.barValue)

    this._abilityInfo = info
  }

  advanceTime(ms){
    if(this._abilityInfo?.cooldownRefreshing){
      this._cooldownBarEl.setValue(ms, { relative: true })
      if(this._cooldownBarEl.pct === 1){
        if(this._abilityInfo.state === AbilityState.RECHARGING){
          this.setAttribute('ability-state', AbilityState.READY)
        }
      }
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