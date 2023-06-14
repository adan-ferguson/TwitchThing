import DIElement from '../../diElement.js'
import { shopItemDisplayInfo } from './shopItemDisplayInfo.js'
import { ICON_SVGS } from '../../../assetLoader.js'

const HTML = `
<div class="shop-item-icon"></div>
<div>
  <span class="shop-item-name"></span> <span class="displaynone shop-item-count"></span>
</div>
<div class="shop-item-description"></div>
<input type="range" class="count-slider displaynone" value="1" min="0"/>
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
        this.events.emit('purchased', this.sliderEl.value)
      })
    }else{
      this.buyButtonEl.setAttribute('disabled', 'disabled')
    }

    this._updateCount()

    return this
  }

  _showSlider(){
    this.sliderEl.classList.remove('displaynone')
    this.sliderEl.value = 0
    this.sliderEl.setAttribute('max', Math.floor(this._userGold / this._shopItemDef.price.gold))
    this.sliderEl.addEventListener('input', () => this._updateCount())
  }

  _updateCount(){
    const count = this._shopItemDef.data?.[this._shopItemDef.id] * this.sliderEl.value
    if(count > 1){
      this.countEl.classList.remove('displaynone')
      this.countEl.textContent = 'x ' + count
    }else{
      this.countEl.classList.add('displaynone')
    }
    this.goldValueEl.textContent = this._shopItemDef.price.gold * this.sliderEl.value
  }
}
customElements.define('di-shop-item-details', ShopItemDetails)