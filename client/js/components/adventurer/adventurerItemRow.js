import DIElement from '../diElement.js'
import { OrbsTooltip } from '../orbRow.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import LoadoutObjectInstance from '../../../../game/loadoutObjectInstance.js'
import EffectDetails from '../effectDetails.js'
import SimpleModal from '../simpleModal.js'
import ItemCard from '../itemCard.js'
import { affectsIcon } from '../common.js'
import { getAbilityDisplayInfoForObj } from '../../displayInfo/abilityDisplayInfo.js'
import { ITEM_ROW_COLORS } from '../../colors.js'

const HTML = `
<di-loadout-row-state></di-loadout-row-state>
<div class="content">
  <div class="flex-columns flex-centered">
    <div class="count-tab displaynone"></div>
    <span class="name"></span>
  </div>
  <div class="flex-columns flex-centered">
    <di-orb-row></di-orb-row>
  </div>
</div>
<div class="hit-area"></div>
`

const RARITY_TO_TEXTURE = {
  0: null,
  1: 'caves',
  2: 'maze-white'
}

export default class AdventurerItemRow extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.orbRow.setOptions({
      tooltip: OrbsTooltip.NONE,
      allowNegatives: true
    })
    this._blank()
    this.addEventListener('contextmenu', e => {
      if(this.adventurerItem){
        e.preventDefault()
        const details = new ItemCard().setItem(this.adventurerItem)
        new SimpleModal(details).show()
      }
    })
  }

  get name(){
    if(!this.adventurerItem){
      return ''
    }
    return `${this.adventurerItem.displayName} ${affectsIcon(this.adventurerItem.vars.affects, true)}`.trim()
  }

  get countEl(){
    return this.querySelector('.count-tab')
  }

  get nameEl(){
    return this.querySelector('.name')
  }

  get orbRow(){
    return this.querySelector('di-orb-row')
  }

  get stateEl(){
    return this.querySelector('di-loadout-row-state')
  }

  get count(){
    return this._options.count
  }

  set count(val){
    this.setOptions({ count: val })
  }

  get item(){
    return this.adventurerItem
  }

  get adventurerItem(){
    return this._adventurerItem
  }

  get adventurerItemInstance(){
    return this._adventurerItemInstance
  }

  get tooltip(){

    if(!this.adventurerItem){
      return null
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new EffectDetails().setObject(this.adventurerItemInstance ?? this.adventurerItem))
    tooltip.appendChild(wrapContent('Right-click for more info', {
      class: 'right-click subtitle'
    }))

    return tooltip
  }

  get defaultOptions(){
    return {
      item: null,
      count: null,
      valid: null,
      orbs: null,
      showState: false,
      shouldBeEmpty: false,
    }
  }

  flash(){
    this.stateEl?.flash()
  }

  _update(){

    if(this._options.item instanceof LoadoutObjectInstance){
      this._adventurerItemInstance = this._options.item
      this._adventurerItem = this._adventurerItemInstance.obj
    }else{
      this._adventurerItemInstance = null
      this._adventurerItem = this._options.item
    }

    this.classList.toggle('should-be-empty', this._options.shouldBeEmpty ? true : false)
    this.classList.toggle('invalid', !(this._options.valid ?? true))
    this.classList.toggle('idle', this._options.showState ? false : true)
    this.classList.toggle('effect-instance', this._adventurerItemInstance ? true : false)
    this.setAttribute('effect-id', this._adventurerItemInstance?.uniqueID ?? null)
    this.setTooltip(this.tooltip)

    if(!this.adventurerItem){
      this._blank()
    }else{
      const count = this.count
      this.countEl.classList.toggle('displaynone', count >= 2 ? false : true)
      this.countEl.textContent = 'x' + count
      this.count = count

      this.nameEl.innerHTML = this.name
      this.orbRow.setData(this._options.orbs ?? this.adventurerItem.orbs)
      this._setTexture()
      this.classList.remove('blank')
    }

    this.stateEl.setOptions({
      loadoutEffectInstance: this._options.showState ? this.adventurerItemInstance : false
    }).update()

    const ado = getAbilityDisplayInfoForObj(this.adventurerItem)
    if(ado[0]?.type === 'active'){
      this.style.borderColor = ITEM_ROW_COLORS.active
      this.style.borderWidth = '2rem'
    }else{
      this.style.borderColor = null
      this.style.borderWidth = null
    }

    return this
  }

  _blank(){
    this.nameEl.textContent = ''
    this.orbRow.setData([])
    this._setTexture(null)
    this.classList.add('blank')
    this.setTooltip(null)
  }

  _setTexture(){
    const textureName = RARITY_TO_TEXTURE[this.adventurerItem?.rarity ?? 0]
    if(!textureName){
      this.style.backgroundImage = null
    }else{
      this.style.backgroundImage = `url('/assets/textures/${textureName}.png')`
    }
  }
}

customElements.define('di-adventurer-item-row', AdventurerItemRow)