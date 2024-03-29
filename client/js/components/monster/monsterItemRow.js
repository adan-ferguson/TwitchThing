import DIElement from '../diElement.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import LoadoutObjectInstance from '../../../../game/loadoutObjectInstance.js'
import EffectDetails from '../effectDetails.js'
import ItemCard from '../itemCard.js'
import SimpleModal from '../simpleModal.js'
import MonsterItemCard from './monsterItemCard.js'

const HTML = `
<di-loadout-row-state></di-loadout-row-state>
<div class="content">
  <span class="name"></span>
</div>
<div class="hit-area"></div>
`

export default class MonsterItemRow extends DIElement{

  _monsterItem
  _monsterItemInstance

  constructor(){
    super()
    this.innerHTML = HTML
    this._blank()
    this.addEventListener('contextmenu', e => {
      if(this.monsterItem){
        e.preventDefault()
        const details = new MonsterItemCard().setItem(this.monsterItem)
        new SimpleModal(details).show()
      }
    })
  }

  get nameEl(){
    return this.querySelector('.name')
  }

  get borderEl(){
    return this.querySelector('.border')
  }

  get monsterItem(){
    return this._monsterItem
  }

  get monsterItemInstance(){
    return this._monsterItemInstance
  }

  get tooltip(){

    if(!this.monsterItem){
      return null
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new EffectDetails().setObject(this.monsterItemInstance ?? this.monsterItem))
    tooltip.appendChild(wrapContent('Right-click for more info', {
      class: 'right-click subtitle'
    }))

    return tooltip
  }

  get defaultOptions(){
    return {
      item: null
    }
  }

  get stateEl(){
    return this.querySelector('di-loadout-row-state')
  }

  flash(){
    this.stateEl?.flash()
  }

  _update(){

    if(this._options.item instanceof LoadoutObjectInstance){
      this._monsterItemInstance = this._options.item
      this._monsterItem = this._monsterItemInstance.obj
    }else{
      this._monsterItemInstance = null
      this._monsterItem = this._options.item
    }

    this.setTooltip(this.tooltip)
    this.classList.toggle('effect-instance', this._monsterItemInstance ? true : false)
    this.setAttribute('effect-id', this._monsterItemInstance?.uniqueID ?? null)

    if(!this.monsterItem){
      this._blank()
    }else{
      this.nameEl.textContent = this.monsterItem.displayName
      this.classList.remove('blank')
    }

    this.stateEl.setOptions({
      loadoutEffectInstance: this._monsterItemInstance
    }).update()

    return this
  }

  _blank(){
    this.nameEl.textContent = ''
    this.classList.add('blank')
    this.setTooltip(null)
    return this
  }
}

customElements.define('di-monster-item-row', MonsterItemRow)