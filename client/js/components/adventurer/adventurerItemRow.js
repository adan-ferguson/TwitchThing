import DIElement from '../diElement.js'
import { OrbsTooltip } from '../orbRow.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import LoadoutObjectInstance from '../../../../game/loadoutObjectInstance.js'
import LoadoutObjectDetails from '../loadoutObjectDetails.js'
import SkillCard from '../skillCard.js'
import SimpleModal from '../simpleModal.js'
import ItemCard from '../itemCard.js'

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
    tooltip.appendChild(new LoadoutObjectDetails().setObject(this.adventurerItemInstance ?? this.adventurerItem))
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
      showState: false
    }
  }

  _update(){

    if(this._options.item instanceof LoadoutObjectInstance){
      this._adventurerItemInstance = this._options.item
      this._adventurerItem = this._adventurerItemInstance.obj
    }else{
      this._adventurerItemInstance = null
      this._adventurerItem = this._options.item
    }

    this.classList.toggle('invalid', !(this._options.valid ?? true))
    this.classList.toggle('idle', this._options.showState ? false : true)
    this.setTooltip(this.tooltip)

    if(!this.adventurerItem){
      this._blank()
    }else{
      const count = this.count
      this.countEl.classList.toggle('displaynone', count >= 2 ? false : true)
      this.countEl.textContent = 'x' + count
      this.count = count

      this.nameEl.textContent = this.adventurerItem.displayName
      this.orbRow.setData(this._options.orbs ?? this.adventurerItem.orbs)
      this._setTexture(this.adventurerItem.isBasic ? null : 'maze-white')
      this.classList.remove('blank')
    }

    this.stateEl.setOptions({
      loadoutEffectInstance: this._options.showState ? this.adventurerItemInstance : false
    })

    return this
  }

  _blank(){
    this.nameEl.textContent = ''
    this.orbRow.setData([])
    this._setTexture(null)
    this.classList.add('blank')
    this.setTooltip(null)
  }

  _setTexture(name){
    if (!name){
      this.style.backgroundImage = null
    } else {
      this.style.backgroundImage = `url('/assets/textures/${name}.png')`
    }
  }
}

customElements.define('di-adventurer-item-row', AdventurerItemRow)