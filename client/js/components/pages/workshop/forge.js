import DIElement from '../../diElement.js'
import AdventurerItemInstance from '../../../../../game/adventurerSlotInstance.js'
import ComponentRow from './componentRow.js'
import { hideLoader, showLoader } from '../../../loader.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <di-workshop-inventory></di-workshop-inventory>
  </div>
  <div class="hinter">
      <div>Choose an item to upgrade</div>
  </div>
  <div class="content-rows">
    <div class="right-column flex-rows hidden">
      <di-item-card class="item-before"></di-item-card>
      <div class="symbol">
        <i class="fa-solid fa-plus"></i>
      </div>
      <div class="content-well">
        <span class="inset-title">Extra Components</span>
        <div class="item-components"></div>
      </div>
      <div class="symbol">
        <i class="fa-solid fa-arrow-down"></i>
      </div>
      <di-item-card class="item-after"></di-item-card>
    </div>
    <button class="upgrade-button flex-no-grow" disabled>Upgrade</button>
  </div>
</div>
`

export default class Forge extends DIElement{

  _adventurers
  _inventory

  get workshopInventoryEl(){
    return this.querySelector('di-workshop-inventory')
  }

  get upgradeButton(){
    return this.querySelector('.upgrade-button')
  }

  async load(){

    await this._fetchData()

    this.innerHTML = HTML
    this.workshopInventoryEl.setup({
      adventurers: this._adventurers,
      userInventory: this._inventory
    }).listEl.setOptions({
      selectableRows: true
    }).events.on('selectrow', row => {
      this._itemSelected(row.loadoutItem.itemInstance)
    })

    this.workshopInventoryEl.adventurerDropdownEl.addEventListener('change', () => {
      this._deselectItem()
    })

    this.upgradeButton.addEventListener('click', async () => {
      showLoader()
      const data = {}
      if(this.workshopInventoryEl.selectedAdventurer){
        const row = this.workshopInventoryEl.listEl.selectedRow
        data.itemSlot = row.__slotIndex
        data.adventurerID = this.workshopInventoryEl.selectedAdventurer?._id
      }else{
        data.itemDef = this._selectedItem.itemDef
      }
      const { upgradedItemDef } = await fizzetch('/game/workshop/forge/upgrade', data)
      if(!upgradedItemDef){
        // TODO: error?
      }
      this._reloadAfterUpgrade(upgradedItemDef)
      hideLoader()
    })
  }

  async _fetchData(){
    const { data } = await fizzetch('/game/workshop/forge')
    this._adventurers = data.adventurers
    this._inventory = data.inventory
  }

  async _reloadAfterUpgrade(upgradedItemDef){
    await this._fetchData()
    this.workshopInventoryEl.update({
      adventurers: this._adventurers,
      userInventory: this._inventory
    }).select(upgradedItemDef)
  }

  _deselectItem(){
    this._selectedItem = null
    this.querySelector('.item-before').setItem(null)
    this.querySelector('.item-after').setItem(null)
    this.querySelector('.item-components').innerHTML = ''
    this.querySelector('.right-column').classList.add('hidden')
    this.upgradeButton.toggleAttribute('disabled', true)
  }

  _itemSelected(itemInstance){
    if(!itemInstance){
      return this._deselectItem()
    }
    this._selectedItem = itemInstance
    const { upgradedItemDef, components } = itemInstance.upgradeInfo()

    this.querySelector('.item-before').setItem(itemInstance)
    this.querySelector('.item-after').setItem(new AdventurerItemInstance(upgradedItemDef))
    this.querySelector('.right-column').classList.remove('hidden')

    const componentsEl = this.querySelector('.item-components')
    componentsEl.innerHTML = ''
    components.map(component => {
      componentsEl.append(new ComponentRow().setData(component, this._inventory))
    })

    this.upgradeButton.toggleAttribute(
      'disabled',
      componentsEl.querySelector('.not-enough') ? true : false
    )
  }
}
customElements.define('di-workshop-forge', Forge)