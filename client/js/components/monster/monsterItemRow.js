import DIElement from '../diElement.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import LoadoutObjectInstance from '../../../../game/loadoutObjectInstance.js'
import MonsterItemCard from './monsterItemCard.js'

const HTML = `
<div class="border">
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
  }

  get nameEl(){
    return this.querySelector('.name')
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
    tooltip.appendChild(new MonsterItemCard().setItem(this.monsterItem))
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

  _update(){

    if(this._options.item instanceof LoadoutObjectInstance){
      debugger
      this._monsterItemInstance = this._options.item
      this._monsterItem = this._monsterItemInstance.obj
    }else{
      this._monsterItemInstance = null
      this._monsterItem = this._options.item
    }

    this.setTooltip(this.tooltip)

    if(!this.monsterItem){
      this._blank()
    }else{
      this.nameEl.textContent = this.monsterItem.displayName
      this.classList.remove('blank')
    }

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