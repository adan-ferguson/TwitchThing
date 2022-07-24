import LoadoutRow from './loadoutRow.js'
import { getAdventurerOrbsData } from '../../../../game/adventurer.js'

const HTML = `
<div class="content-rows">
    <div class="filtering-options content-no-grow">
        Filtering options here
    </div>
    <di-list></di-list>
</div>
`

export default class Inventory extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.filteringOptions = this.querySelector('.filteringOptions')
    this.list = this.querySelector('di-list')
    this.list.setOptions({
      pageSize: 15
    })
  }

  get sortFn(){
    return SORT_FUNCTIONS.date
  }

  filterFn = (el) => {
    return isCompatible(this.adventurer, el.loadoutItem.obj)
  }

  setup(items, adventurer){
    this.adventurer = adventurer
    const loadoutRows = []
    Object.values(items).forEach(loadoutItem => {
      if(loadoutItem){
        const row = new LoadoutRow()
        row.setItem(loadoutItem)
        row.showNewBadge(loadoutItem.isNew)
        loadoutRows.push(row)
      }
    })
    this.list.setOptions({
      sortFn: this.sortFn,
      filterFn: this.filterFn,
      showFiltered: true
    })
    this.list.setRows(loadoutRows)
  }

  addItem(item){
    if(!item){
      return
    }
    const row = new LoadoutRow()
    row.setItem(item)
    this.list.addRow(row)
  }

  removeItem(item){
    const row = this.list.findRow(row => row.loadoutItem === item)
    this.list.removeRow(row)
  }
}

function isCompatible(adventurer, itemInstance){
  return getAdventurerOrbsData(adventurer, [itemInstance]).isValid
}

const SORT_FUNCTIONS = {
  date: null, // Default sorting is by date, so unsorted is just as good
  class: (rowA, rowB) => {
    const instanceA = rowA.loadoutItem.obj
    const instanceB = rowB.loadoutItem.obj
  }
}

customElements.define('di-inventory', Inventory)