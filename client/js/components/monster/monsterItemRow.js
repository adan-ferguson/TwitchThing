import DIElement from '../diElement.js'
import { wrapContent } from '../../../../game/utilFunctions.js'

const HTML = `
<div class="border">
    <span class="name"></span>
</div>
<div class="hit-area"></div>
`

export default class MonsterItemRow extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this._blank()
  }

  get nameEl(){
    return this.querySelector('.name')
  }

  get item(){
    return this._options.item
  }

  get tooltip(){

    if(!this._options.item){
      return null
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new MonsterItemCard().setItem(this._options.item))
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

    this.setTooltip(this.tooltip)

    if(!this.item){
      this._blank()
    }else{
      this.nameEl.textContent = this.item.displayName
      this.classList.remove('blank')
    }
    return this
  }

  _blank(){
    this.nameEl.textContent = ''
    this.classList.add('blank')
    this.setTooltip(null)
  }
}

customElements.define('di-monster-item-row', MonsterItemRow)