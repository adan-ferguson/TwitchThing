import DIElement from '../../diElement.js'
import { shopItemDisplayInfo } from './shopItemDisplayInfo.js'
import { ICON_SVGS } from '../../../assetLoader.js'
import { arithmeticSum } from '../../../../../game/growthFunctions.js'
import { advLevelToXp } from '../../../../../game/adventurer.js'

const HTML = `
<div class="shop-item-icon"></div>
<div>
  <span class="shop-item-name"></span> <span class="shop-item-count"></span>
</div>
<div class="shop-item-description"></div>
<div class="flex-columns slider-controls displaynone">
  <button class="minus"><i class="fa-solid fa-minus"></i></button>
  <input type="range" class="count-slider" value="1" min="0"/>
  <button class="plus"><i class="fa-solid fa-plus"></i></button>
</div>
<button class="buy-button">
  <span>Buy</span>
  <span class="gold-value"></span>
  ${ICON_SVGS.gold}
</button>
`

export default class ShopItemDetails extends DIElement{

  get countEl(){
    return this.querySelector('.shop-item-count')
  }

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

  get sliderEl(){
    return this.querySelector('.count-slider')
  }

  setItem(shopItemDef, userGold){
    this.innerHTML = HTML
    this._shopItemDef = shopItemDef
    this._userGold = userGold

    const info = shopItemDisplayInfo(shopItemDef)
    this.iconEl.innerHTML = info.imageHtml
    this.nameEl.textContent = info.name

    this.descriptionEl.append(info.description)

    if(info.color){
      this.style.color = info.color
    }

    if(shopItemDef.scalable){
      this._showSlider()
    }

    if(userGold >= shopItemDef.price.gold){
      this.buyButtonEl.addEventListener('click', () => {
        this.buyButtonEl.setAttribute('disabled', 'disabled')
        this.events.emit('purchased', parseInt(this.sliderEl.value))
      })
    }else{
      this.buyButtonEl.setAttribute('disabled', 'disabled')
    }

    this._updateCount()

    return this
  }

  _showSlider(){
    this.querySelector('.slider-controls').classList.remove('displaynone')
    this.sliderEl.value = 0
    this.sliderEl.setAttribute('max', Math.floor(this._userGold / this._shopItemDef.price.gold))
    this.sliderEl.addEventListener('input', () => this._updateCount())
    this.querySelector('.minus').addEventListener('click', () => {
      this.sliderEl.value -= 1
      this._updateCount()
    })
    this.querySelector('.plus').addEventListener('click', () => {
      this.sliderEl.value = parseInt(this.sliderEl.value) + 1
      this._updateCount()
    })
  }

  _updateCount(){
    const val = this._shopItemDef.data?.[this._shopItemDef.id] ?? 1
    const sliderVal = this.sliderEl.value
    let count
    if(val.base){
      count = arithmeticSum(val.base, val.growth, sliderVal)
    }else{
      count = val * sliderVal
    }
    if(!this._shopItemDef.scalable){
      this.countEl.classList.add('displaynone')
    }else{
      this.countEl.textContent = 'x ' + count
    }
    this.goldValueEl.textContent = this._shopItemDef.price.gold * this.sliderEl.value
  }
}
customElements.define('di-shop-item-details', ShopItemDetails)