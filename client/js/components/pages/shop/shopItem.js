import DIElement from '../../diElement.js'
import classDisplayInfo from '../../../displayInfo/classDisplayInfo.js'
import { shopItemDisplayInfo } from './shopItemDisplayInfo.js'
import { ICON_SVGS } from '../../../assetLoader.js'

const HTML = `
<div class="shop-item-image"></div>
<div class="shop-item-name"></div>
<div class="price-row">
  ${ICON_SVGS.gold}<span class="price"></span>
</div>
`

export default class ShopItem extends DIElement{

  setItem(shopItemDef){
    this.innerHTML = HTML

    const info = shopItemDisplayInfo(shopItemDef)
    this.querySelector('.shop-item-image').innerHTML = info.imageHtml
    this.querySelector('.shop-item-name').textContent = info.name ?? ''
    this.querySelector('.price').textContent = shopItemDef.price.gold ?? 0

    if(shopItemDef.data?.className){
      const classInfo = classDisplayInfo(shopItemDef.data.className)
      this.style.color = classInfo.color
    }

    return this
  }
}

customElements.define('di-shop-item', ShopItem)