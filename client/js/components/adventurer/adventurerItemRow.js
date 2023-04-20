import DIElement from '../diElement.js'
import { OrbsTooltip } from '../orbRow.js'
import ItemCard from '../itemCard.js'
import { wrapContent } from '../../../../game/utilFunctions.js'

const HTML = `
<div class="border">
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

  get item(){
    return this._options.item
  }

  get count(){
    return this._options.count
  }

  set count(val){
    this.setOptions({ count: val })
  }

  get tooltip(){

    if(!this._options.item){
      return null
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new ItemCard().setItem(this._options.item))
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
      orbs: null
    }
  }

  _update(){

    this.classList.toggle('invalid', !(this._options.valid ?? true))
    this.setTooltip(this.tooltip)

    if(!this.item){
      this._blank()
    }else{

      const count = this.count
      this.countEl.classList.toggle('displaynone', count >= 2 ? false : true)
      this.countEl.textContent = 'x' + count
      this.count = count

      this.nameEl.textContent = this.item.displayName
      this.orbRow.setData(this._options.orbs ?? this.item.orbs)
      this._setTexture(this.item.isBasic ? null : 'maze-white')
      this.classList.remove('blank')
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

  _setTexture(name){
    if (!name){
      this.style.backgroundImage = null
    } else {
      this.style.backgroundImage = `url('/assets/textures/${name}.png')`
    }
  }
}

customElements.define('di-adventurer-item-row', AdventurerItemRow)