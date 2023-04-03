import DIElement from '../diElement.js'
import { OrbsTooltip } from '../orbRow.js'
import SkillCard from '../skillCard.js'
import ItemCard from '../itemCard.js'

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

  _item
  _count = 1

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
    return this._item
  }

  get count(){
    return this._count
  }

  set count(val){
    this._count = val
  }

  get tooltip(){

    if(!this.item){
      return null
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new ItemCard().setItem(this.item))
    // tooltip.appendChild(wrapContent('Right-click for more info', {
    //   class: 'right-click subtitle'
    // }))

    return tooltip
  }

  setItem(adventurerItem){
    this._item = adventurerItem
    if(!adventurerItem){
      this._blank()
    }else{
      this.nameEl.textContent = adventurerItem.displayName
      this.orbRow.setData(adventurerItem.orbs)
      this._setTexture(adventurerItem.isBasic ? null : 'maze-white')
      this.classList.remove('blank')
      this.setTooltip()
    }
    return this
  }

  setCount(count){
    this.countEl.classList.toggle('displaynone', count >= 2 ? false : true)
    this.countEl.textContent = 'x' + count
    this.count = count
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