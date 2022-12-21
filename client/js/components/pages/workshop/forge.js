import DIElement from '../../diElement.js'
import AdventurerItemInstance from '../../../../../game/adventurerItemInstance.js'
import ComponentRow from './componentRow.js'
import { hideLoader, showLoader } from '../../../loader.js'
import fizzetch from '../../../fizzetch.js'
import OrbRow, { OrbsDisplayStyle } from '../../orbRow.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <di-workshop-inventory></di-workshop-inventory>
  </div>
  <div class="hinter">
      <div><--</div>
      <div>Click items to swap</div>
      <div>--></div>
  </div>
  <div class="content-rows">
    <div class="content-no-grow right-column">
      <div class="content-well item-before">
        <span class="inset-title item-name displaynone"></span>
        <span class="inset-title-right item-orbs displaynone"></span>
        <di-item-full-details></di-item-full-details>
      </div>
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
      <div class="content-well item-after">
        <span class="inset-title item-name displaynone"></span>
        <span class="inset-title-right item-orbs displaynone"></span>
        <di-item-full-details></di-item-full-details>
      </div>
    </div>
    <button class="upgrade-button" disabled>Upgrade</button>
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
      title: 'Choose item to upgrade',
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
    setItem(this.querySelector('.item-before'), null)
    setItem(this.querySelector('.item-after'), null)
    this.querySelector('.item-components').innerHTML = ''
    this.upgradeButton.toggleAttribute('disabled', true)
  }

  _itemSelected(itemInstance){
    if(!itemInstance){
      return this._deselectItem()
    }
    this._selectedItem = itemInstance
    const { upgradedItemDef, components } = itemInstance.upgradeInfo()

    setItem(this.querySelector('.item-before'), itemInstance)
    setItem(this.querySelector('.item-after'), new AdventurerItemInstance(upgradedItemDef))

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

function setItem(el, item){
  const name = el.querySelector('.item-name')
  name.textContent = item?.displayName
  name.classList.toggle('displaynone', item ? false : true)

  debugger
  const orbs = el.querySelector('.item-orbs')
  orbs.innerHTML = ''
  if(item){
    orbs.appendChild(new OrbRow().setOptions({ style: OrbsDisplayStyle.MAX_ONLY }).setData(item.orbs))
  }
  orbs.classList.toggle('displaynone', item ? false : true)

  el.querySelector('di-item-full-details').setItem(item)
}