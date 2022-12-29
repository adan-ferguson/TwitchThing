import DIElement from '../../diElement.js'
import { makeEl, roundToFixed } from '../../../../../game/utilFunctions.js'
import classDisplayInfo from '../../../classDisplayInfo.js'
import chestImage from '../../chestImage.js'
import { getItemPicker } from '../../../../../server/items/generator.js'
import _ from 'lodash'
import { shopItemDisplayInfo } from './shopItemDisplayInfo.js'

const DROP_CHANCE_HTML = (orbIcon, level, chance) => `
<img src="${orbIcon}">${level} - ${chance}%
`

const HTML = `
<div class="shop-item-icon"></div>
<div class="shop-item-name"></div>
<div class="shop-item-description"></div>
<button class="buy-button">
  <span>Buy</span>
  <span class="gold-value"></span>
  <img src="/assets/icons/gold.svg">
</button>
`

export default class ShopItemDetails extends DIElement{

  get iconEl(){
    return this.querySelector('.shop-item-icon')
  }

  get nameEl(){
    return this.querySelector('.shop-item-name')
  }

  get descriptionEl(){
    return this.querySelector('.shop-item-description')
  }

  get buyButtonEl(){
    return this.querySelector('.buy-button')
  }

  get goldValueEl(){
    return this.querySelector('.gold-value')
  }

  setItem(shopItemDef, canBuy){
    this.innerHTML = HTML

    const info = shopItemDisplayInfo(shopItemDef)
    this.iconEl.append(info.makeImage())
    this.nameEl.textContent = info.name
    this.descriptionEl.append(info.description)

    if(info.color){
      this.style.color = info.color
    }

    // if(shopItemDef.type === 'chest'){
    //   this.descriptionEl.append(this._dropChances(shopItemDef))
    // }

    this.goldValueEl.textContent = shopItemDef.price.gold

    if(canBuy){
      this.buyButtonEl.addEventListener('click', () => {
        this.buyButtonEl.setAttribute('disabled', 'disabled')
        this.events.emit('purchased')
      })
    }else{
      this.buyButtonEl.setAttribute('disabled', 'disabled')
    }

    return this
  }

  _dropChances(shopItemDef){
    const classInfo = classDisplayInfo(shopItemDef.data.className)
    const chances = calcChances(shopItemDef.data.level)
    const dropChancesEl = makeEl({ class: 'drop-chance' })
    for(let i = 1; i <= 10; i++){
      dropChancesEl.appendChild(makeEl({
        content: DROP_CHANCE_HTML(classInfo.orbIcon, i, chances[i])
      }))
    }
    return dropChancesEl
  }
}
customElements.define('di-shop-item-details', ShopItemDetails)

function calcChances(level){
  const itemPicker = getItemPicker()
  const choices = []
  for(let i = 1; i <= 10; i++){
    choices[i] = itemPicker.weight(i, level)
  }
  const sum = _.sum(choices)
  return choices.map(c => roundToFixed(100 * c / sum, 1))
}