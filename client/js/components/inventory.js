import { mergeOptionsObjects } from '../../../game/utilFunctions.js'
import DIElement from './diElement.js'
import { inventoryItemsToRows, makeAdventurerItemRow, standardItemSort } from './listHelpers.js'
import AdventurerItemRow from './adventurer/adventurerItemRow.js'

const HTML = `
<div class="content-rows">
  <div class="inset-title">Items</div>
  <di-list></di-list>
</div>
`

const STORAGE_NAME = 'filterSortOptions'

export default class Inventory extends DIElement{

  _filterSortOptions = {
    sortBy: 'class',
    hideOther: false
  }

  constructor(){
    super()
    this.innerHTML = HTML
    this.listEl.setOptions({
      pageSize: 15,
      blankFn: () => new AdventurerItemRow()
    })
  }

  /**
   * @returns {List}
   */
  get listEl(){
    return this.querySelector('di-list')
  }

  filterFn = row => {
    return row.adventurerItem && Object.keys(this.adventurer.orbs).includes(row.adventurerItem.advClass)
    // return row.item?.classes.every(cls => this.adventurer.orbs[cls]) ?? false
  }

  setup(items, adventurer){
    this.adventurer = adventurer
    // this.querySelector('.inventory-options').classList.toggle('displaynone', adventurer ? false : true)
    this._updateSortAndFilter()
    this.listEl.setRows(inventoryItemsToRows(items))
    return this
  }

  addItem(adventurerItem){
    if(!adventurerItem){
      return
    }
    if(adventurerItem.isBasic){
      const row = this.listEl.findRow(row => row.item.sameItem(adventurerItem))
      if(row){
        row.count += 1
        return
      }
    }
    this.listEl.addRow(makeAdventurerItemRow(adventurerItem))
  }

  removeItem(item){
    const row = this.listEl.findRow(row => row.item === item)
    if(!row){
      return
    }
    if(item.isBasic && row.count > 1){
      row.count -= 1
    }else{
      this.listEl.removeRow(row)
    }
  }

  _setupFilteringOptions(){

    const stored = localStorage.getItem(STORAGE_NAME)
    if(stored){
      this._filterSortOptions = mergeOptionsObjects(this._filterSortOptions, JSON.parse(stored))
    }

    const filteringOptions = this.querySelector('.filtering-options')
    const hideOther = filteringOptions.querySelector('input[name="hideOther"]')
    hideOther.checked = this._filterSortOptions.hideOther
    hideOther.addEventListener('input', e => {
      this._filterSortOptions.hideOther = hideOther.checked
      this._updateSortAndFilter()
    })

    const sortBy = filteringOptions.querySelectorAll('input[name="sortBy"]')
    sortBy.forEach(radio => {
      radio.checked = this._filterSortOptions.sortBy === radio.value
      radio.addEventListener('input', e => {
        this._filterSortOptions.sortBy = radio.value
        this._updateSortAndFilter()
      })
    })
  }

  _updateSortAndFilter(){
    localStorage.setItem(STORAGE_NAME, JSON.stringify(this._filterSortOptions))
    this.listEl.setOptions({
      sortFn: standardItemSort,
      filterFn: this.filterFn,
      showFiltered: true //!this._filterSortOptions.hideOther
    })
  }
}

customElements.define('di-inventory', Inventory)