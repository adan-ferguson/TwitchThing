import DIElement from '../../diElement.js'
import classDisplayInfo from '../../../classDisplayInfo.js'
import { shopItemDisplayInfo } from './shopItemDisplayInfo.js'

const HTML = `
<div class="shop-item-image"></div>
<div class="shop-item-name"></div>
<div class="price-row">
  <img src="/assets/icons/gold.svg"><span class="price"></span>
</div>
`

export default class ShopItem extends DIElement{

  setItem(shopItemDef){
    this.innerHTML = HTML

    const info = shopItemDisplayInfo(shopItemDef)
    this.querySelector('.shop-item-image').append(info.makeImage())
    this.querySelector('.shop-item-name').textContent = info.name
    this.querySelector('.price').textContent = shopItemDef.price.gold ?? 0

    if(shopItemDef.data?.className){
      const classInfo = classDisplayInfo(shopItemDef.data.className)
      this.style.color = classInfo.color
    }

    return this
  }
}

customElements.define('di-shop-item', ShopItem)