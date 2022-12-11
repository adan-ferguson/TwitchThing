import DIElement from '../../diElement.js'
import AdventurerItemInstance from '../../../../../game/adventurerItemInstance.js'
import ComponentRow from './componentRow.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <div class="supertitle flex-no-grow">Choose Item To Upgrade</div>
    <select class="adventurer-dropdown flex-no-grow">
      <option value="0">In Inventory</option>
    </select>
    <di-inventory class="fill-contents"></di-inventory>
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
    <button disabled>Upgrade</button>
  </div>
</div>
`

export default class Forge extends DIElement{

  get inventoryEl(){
    return this.querySelector('di-inventory')
  }

  get adventurerDropdownEl(){
    return this.querySelector('.adventurer-dropdown')
  }

  setData(data){
    this.innerHTML = HTML
    this._data = data
    this._setupDropdown(data.adventurers)
    this._updateList()
    this.inventoryEl.setOptions({
      select: row => {
        this._itemSelected(row.loadoutItem.itemInstance)
      }
    })
  }

  _setupDropdown(adventurers){
    const el = this.adventurerDropdownEl
    adventurers.forEach(adv => {
      const option = document.createElement('option')
      option.value = adv._id
      option.textContent = adv.name + (adv.dungeonRunID ? ' (Busy)' : '')
      el.appendChild(option)
    })
    el.addEventListener('change', () => {
      this._updateList()
    })
  }

  _updateList(){
    const selectedVal = this.adventurerDropdownEl.value
    const adv = this._data.adventurers.find(adv => adv._id === selectedVal)
    if(adv){
      this.inventoryEl.setup(adv.items).setOptions({
        disabledFn: () => adv.dungeonRunID ? false : true
      })
    }else{
      this.inventoryEl.setup(this._data.inventory.items).setOptions({
        disabledFn: null
      })
    }
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
  }
}
customElements.define('di-workshop-forge', Forge)