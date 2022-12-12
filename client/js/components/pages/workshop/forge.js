import DIElement from '../../diElement.js'
import AdventurerItemInstance from '../../../../../game/adventurerItemInstance.js'
import ComponentRow from './componentRow.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <di-workshop-inventory></di-workshop-inventory>
  </div>
  <div class="content-rows">
    <div class="content-no-grow right-column">
      <div class="content-well">
        <di-item-full-details class="item-before"></di-item-full-details>
        <div class="item-components"></div>
      </div>
      <div class="symbol">
        <i class="fa-solid fa-arrow-down"></i>
      </div>
      <div class="content-well">
        <di-item-full-details class="item-after"></di-item-full-details>
      </div>
    </div>
    <button class="upgrade-button" disabled>Upgrade</button>
  </div>
</div>
`

export default class Forge extends DIElement{

  get workshopInventoryEl(){
    return this.querySelector('di-workshop-inventory')
  }

  get upgradeButton(){
    return this.querySelector('.upgrade-button')
  }

  setData(data){
    this._data = data
    this.innerHTML = HTML

    this.workshopInventoryEl.setup({
      title: 'Choose item to upgrade',
      adventurers: data.adventurers,
      userInventory: data.inventory
    }).listEl.setOptions({
      selectableRows: true
    }).events.on('selectrow', row => {
      this._itemSelected(row.loadoutItem.itemInstance)
    })
  }

  _itemSelected(itemInstance){
    this._selectedItemDef = itemInstance.itemDef
    const { upgradedItemDef, components } = itemInstance.upgradeInfo()

    this.querySelector('.item-before').setItem(itemInstance)
    this.querySelector('.item-after').setItem(new AdventurerItemInstance(upgradedItemDef))

    const componentsEl = this.querySelector('.item-components')
    componentsEl.innerHTML = ''
    components.map(component => {
      componentsEl.append(new ComponentRow().setData(component, this._data.inventory))
    })

    this.upgradeButton.toggleAttribute(
      'disabled',
      componentsEl.querySelector('.not-enough') ? true : false
    )
  }
}
customElements.define('di-workshop-forge', Forge)