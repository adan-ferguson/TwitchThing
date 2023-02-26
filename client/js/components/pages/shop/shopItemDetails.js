import DIElement from '../../diElement.js'
import { shopItemDisplayInfo } from './shopItemDisplayInfo.js'
import { ICON_SVGS } from '../../../assetLoader.js'

const HTML = `
<div class="shop-item-icon"></div>
<div class="shop-item-name"></div>
<div class="shop-item-description"></div>
<button class="buy-button">
  <span>Buy</span>
  <span class="gold-value"></span>
  ${ICON_SVGS.gold}
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
    this.iconEl.innerHTML = info.imageHtml
    this.nameEl.textContent = info.name
    this.descriptionEl.append(info.description)

    if(info.color){
      this.style.color = info.color
    }

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
}
customElements.define('di-shop-item-details', ShopItemDetails)