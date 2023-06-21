import DIElement from './diElement.js'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import ComponentRow from './pages/workshop/componentRow.js'
import { hideLoader, showLoader } from '../loader.js'
import fizzetch from '../fizzetch.js'

const HTML = `
<div class="item-cards">
  <di-item-card class="item-before"></di-item-card>
  <div class="symbol hide-if-max">
    <i class="fa-solid fa-arrow-right"></i>
  </div>
  <di-item-card class="item-after hide-if-max"></di-item-card>
</div>
<div class="components content-well hide-if-max">
  <span class="inset-title">Extra Components</span>
  <div class="item-components"></div>
</div>
<button class="upgrade-button"></button>
`

export default class ItemQuickUpgrade extends DIElement{
  constructor(adventurerItem, inventory, isEquipped){
    super()
    this.innerHTML = HTML

    const { upgradedItemDef, components } = adventurerItem.upgradeInfo()

    this.querySelector('.item-before').setItem(adventurerItem)

    const button = this.querySelector('.upgrade-button')
    const componentsEl = this.querySelector('.item-components')

    const maxLevel = upgradedItemDef ? false : true
    if(maxLevel){
      this.classList.add('max-level')
      button.disabled = true
      button.textContent = 'Max Level'
      return
    }else{
      this.querySelector('.item-after').setItem(new AdventurerItem(upgradedItemDef))
      components.map(component => {
        if(adventurerItem.isBasic && isEquipped){
          component.count--
        }
        componentsEl.append(new ComponentRow().setData(component, inventory))
      })
    }

    const notEnough = componentsEl.querySelector('.not-enough') ? true : false
    button.disabled = notEnough
    button.textContent = notEnough ? 'Not Enough Components' : 'Upgrade'
  }
}

customElements.define('di-item-quick-upgrade', ItemQuickUpgrade)