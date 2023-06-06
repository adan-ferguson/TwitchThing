import DIElement from '../../diElement.js'
import classDisplayInfo from '../../../displayInfo/classDisplayInfo.js'
import { shopItemDisplayInfo } from './shopItemDisplayInfo.js'
import { ICON_SVGS } from '../../../assetLoader.js'
import { goldEntry } from '../../common.js'

const HTML = `
<div class="shop-item-image"></div>
<div class="shop-item-name"></div>
<div class="price-row"></div>
`

export default class ShopItem extends DIElement{

  setItem(shopItemDef){
    this.innerHTML = HTML

    const info = shopItemDisplayInfo(shopItemDef)
    this.querySelector('.shop-item-image').innerHTML = info.imageHtml
    this.querySelector('.shop-item-name').textContent = info.name ?? ''
    this.querySelector('.price-row').innerHTML = goldEntry(shopItemDef.price.gold || 'Free')

    this.style.color = info.color

    return this
  }
}

customElements.define('di-shop-item', ShopItem)