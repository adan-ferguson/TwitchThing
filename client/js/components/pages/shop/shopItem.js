import DIElement from '../../diElement.js'
import classDisplayInfo from '../../../classDisplayInfo.js'

const CHEST_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
<g stroke-width="0">
<path d="M2,50 L0,27 L17,27 L18,32 L32,32 L33,27 L50,27 L48,50"/>
<path d="M0,25 L2,6 L8,3 L42,3 L48,6 L50,25 L33,25 L32,17 L18,17 L17,25"/>
<rect x="23" y="21" width="4" height="8"/>
</g>
</svg>
`

const CHEST = orbSrc => `
<div class="chest-el">
  ${CHEST_SVG}
  <img class="absolute-center-both" src="${orbSrc}">
</div>
`

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
    setImages(this.querySelector('.shop-item-image'), shopItemDef)
    this.querySelector('.shop-item-name').textContent = getName(shopItemDef)
    this.querySelector('.price').textContent = shopItemDef.price.gold ?? 0

    if(shopItemDef.data?.className){
      const classInfo = classDisplayInfo(shopItemDef.data.className)
      this.style.color = classInfo.color
    }

    return this
  }

}
customElements.define('di-shop-item', ShopItem)

function getName(shopItemDef){
  if(shopItemDef.type === 'adventurerSlot'){
    return 'Adventurer Slot'
  }else if(shopItemDef.type === 'chest'){
    const classInfo = classDisplayInfo(shopItemDef.data.className)
    return `Lvl. ${shopItemDef.data.level} ${classInfo.displayName} Chest`
  }
}

function setImages(el, shopItemDef){
  if(shopItemDef.type === 'adventurerSlot'){
    el.appendChild(makeImg('/assets/icons/adventurerSlot.svg'))
  }else if(shopItemDef.type === 'chest'){
    const classInfo = classDisplayInfo(shopItemDef.data.className)
    el.innerHTML = CHEST(classInfo.orbIcon)
  }
}

function makeImg(src){
  const img = document.createElement('img')
  img.src = src
  return img
}