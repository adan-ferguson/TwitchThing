import DIElement from '../../diElement.js'
import { adventurerItemsToRows, inventoryItemsToRows, standardItemSort } from '../../listHelpers.js'

const HTML = `
<div class="flex-rows">
  <div class="supertitle flex-no-grow"></div>
  <select class="adventurer-dropdown flex-no-grow">
    <option value="0">In Inventory</option>
  </select>
  <di-list></di-list>
</div>
`

export default class WorkshopInventory extends DIElement{

  get adventurerDropdownEl(){
    return this.querySelector('.adventurer-dropdown')
  }

  /**
   * @returns {List}
   */
  get listEl(){
    return this.querySelector('di-list')
  }

  get selectedAdventurer(){
    if(!this._adventurers){
      return null
    }
    const selectedVal = this.adventurerDropdownEl.value
    return this._adventurers.find(adv => adv._id === selectedVal)
  }

  setup({ title, adventurers, userInventory }){
    this.innerHTML = HTML
    this.listEl.setOptions({
      showFiltered: true,
      pageSize: 15,
      clickableRows: true
    })
    this.querySelector('.supertitle').textContent = title
    this._userInventory = userInventory
    if(adventurers){
      this._adventurers = adventurers
      this._setupDropdown(adventurers)
    }
    this.adventurerDropdownEl.classList.toggle('displaynone', this._adventurers ? false : true)
    this._updateList()
    return this
  }

  update({ adventurers, userInventory }){
    if(adventurers){
      this._adventurers = adventurers
    }
    this._userInventory = userInventory
    this._updateList()
    return this
  }

  select(itemDef){
    if(!itemDef.id){
      return
    }
    const row = this.listEl.allRows.find(row => {
      return row.loadoutItem?.itemInstance?.id === itemDef.id
    })
    if(row){
      row.click()
    }
  }

  _setupDropdown(adventurers){
    const el = this.adventurerDropdownEl
    adventurers.forEach(adv => {
      const option = document.createElement('option')
      option.value = adv._id
      option.textContent = adv.name + (adv.dungeonRunID ? ' (Busy)' : '')
      option.toggleAttribute('disabled', adv.dungeonRunID ? true : false)
      el.appendChild(option)
    })
    el.addEventListener('change', () => {
      this._updateList()
    })
  }
  
  _updateList(){
    const adv = this.selectedAdventurer
    if(adv){
      this.listEl
        .setOptions({
          filterFn: () => adv.dungeonRunID ? false : true,
          sortFn: null
        })
        .setRows(adventurerItemsToRows(adv.items))
    }else{
      this.listEl
        .setOptions({
          filterFn: null,
          sortFn: standardItemSort
        })
        .setRows(inventoryItemsToRows(this._userInventory.items))
    }
  }
}
customElements.define('di-workshop-inventory', WorkshopInventory)