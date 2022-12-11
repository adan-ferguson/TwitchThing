import DIElement from '../../diElement.js'

const HTML = `
<div class="supertitle flex-no-grow"></div>
<select class="adventurer-dropdown flex-no-grow">
  <option value="0">In Inventory</option>
</select>
<di-inventory class="fill-contents"></di-inventory>
`

export default class WorkshopInventory extends DIElement{

  get adventurerDropdownEl(){
    return this.querySelector('.adventurer-dropdown')
  }

  /**
   * @returns {Inventory}
   */
  get inventoryEl(){
    return this.querySelector('di-inventory')
  }

  setup({ title, adventurers, userInventory }){
    this.querySelector('.supertitle').textContent = title
    this._userInventory = userInventory
    this._adventurers = adventurers
    this._setupDropdown(adventurers)
    this._updateList()
    return this
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
    const adv = this._adventurers.find(adv => adv._id === selectedVal)
    if(adv){
      this.inventoryEl.setup(adv.items).setOptions({
        disabledFn: () => adv.dungeonRunID ? false : true
      })
    }else{
      this.inventoryEl.setup(this._userInventory.items).setOptions({
        disabledFn: null
      })
    }
  }
}
customElements.define('di-workshop-inventory', WorkshopInventory)