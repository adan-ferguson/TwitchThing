import { mergeOptionsObjects } from '../../../../game/utilFunctions.js'
import DIElement from '../diElement.js'
import { inventoryItemsToRows, standardItemSort } from '../listHelpers.js'
import LoadoutRow from './loadoutRow.js'

const HTML = `
<div class="content-rows">
<!--  <div class="content-no-grow inventory-options">-->
<!--    <div class="input-group">-->
<!--      Sort By:-->
<!--      <label><input type="radio" name="sortBy" value="class">Class</label>-->
<!--    </div>-->
<!--    <div class="filtering-options require-adventurer displaynone">-->
<!--      <label><input type="checkbox" name="hideOther"> Hide Unequippable</label>-->
<!--    </div>-->
<!--  </div>-->
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
    this._setupFilteringOptions()
    this.list = this.querySelector('di-list')
    this.list.setOptions({
      pageSize: 15
    })
  }

  /**
   * @returns {List}
   */
  get listEl(){
    return this.querySelector('di-list')
  }

  filterFn = row => {
    return isCompatible(this.adventurer, row.loadoutItem.itemInstance)
  }

  setup(items, adventurer){
    this.adventurer = adventurer
    this.querySelector('.inventory-options').classList.toggle('displaynone', adventurer ? false : true)
    this._updateSortAndFilter()
    this.list.setRows(inventoryItemsToRows(items))
    return this
  }

  addItem(item){
    if(!item){
      return
    }
    if(item.itemInstance.isBasic){
      const row = this.list.findRow(row => row.loadoutItem.equals(item))
      if(row){
        row.count++
        return
      }
    }
    item.itemInstance.owner = null
    const row = new LoadoutRow()
    row.setItem(item)
    this.list.addRow(row)
  }

  removeItem(item){
    const row = this.list.findRow(row => row.loadoutItem === item)
    if(!row){
      return
    }
    if(item.itemInstance.isBasic && row.count > 1){
      row.count--
    }else{
      this.list.removeRow(row)
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
    this.list.setOptions({
      sortFn: standardItemSort,
      filterFn: this.filterFn,
      showFiltered: !this._filterSortOptions.hideOther
    })
  }
}

function isCompatible(adventurer, itemInstance){
  const itemClasses = itemInstance.classes
  return itemClasses.every(cls => adventurer.bonuses[cls])
}

customElements.define('di-inventory', Inventory)