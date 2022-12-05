import LoadoutRow from './loadoutRow.js'
import { mergeOptionsObjects } from '../../../../game/utilFunctions.js'
import FighterItemDisplayInfo from '../../fighterItemDisplayInfo.js'
import AdventurerItemInstance from '../../../../game/adventurerItemInstance.js'

const HTML = `
<div class="content-rows">
    <div class="filtering-options content-no-grow">
        <div class="input-group">
            Sort By:
            <label><input type="radio" name="sortBy" value="class">Class</label>
        </div>
        <label><input type="checkbox" name="hideOther"> Hide Unequippable</label>
    </div>
    <di-list></di-list>
</div>
`

const STORAGE_NAME = 'filterSortOptions'

export default class Inventory extends HTMLElement{

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
      pageSize: 14
    })
  }

  get sortFn(){
    return SORT_FUNCTIONS[this._filterSortOptions.sortBy]
  }

  filterFn = (el) => {
    return isCompatible(this.adventurer, el.loadoutItem.itemInstance)
  }

  setup(items, adventurer){
    this.adventurer = adventurer

    const loadoutRows = []
    Object.keys(items.basic).forEach(group => {
      Object.keys(items.basic[group]).forEach(name => {
        const info = new FighterItemDisplayInfo(new AdventurerItemInstance({ group, name }))
        const row = new LoadoutRow()
          .setItem(info)
          .setCount(items.basic[group][name])
        loadoutRows.push(row)
      })
    })

    // TODO: crafted items
    // Object.values(items).forEach(loadoutItem => {
    //   if(loadoutItem){
    //     const row = new LoadoutRow()
    //     row.setItem(loadoutItem)
    //     row.showNewBadge(loadoutItem.isNew)
    //     loadoutRows.push(row)
    //   }
    // })

    this._updateSortAndFilter()
    this.list.setRows(loadoutRows)
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
      sortFn: this.sortFn,
      filterFn: this.filterFn,
      showFiltered: !this._filterSortOptions.hideOther
    })
  }
}

function isCompatible(adventurer, itemInstance){
  const itemClass = itemInstance.itemDef.group
  return adventurer.bonuses[itemClass] ? true : false
  // const ai = new AdventurerInstance({
  //   ...adventurer,
  //   items: [itemInstance.itemDef]
  // })
  // return ai.orbs.isValid
}

const SORT_FUNCTIONS = {
  date: null, // Default sorting is by date, so unsorted is just as good
  class: (rowA, rowB) => {

    const orbsA = rowA.loadoutItem.orbs._maxOrbs
    const orbsB = rowB.loadoutItem.orbs._maxOrbs

    const classesA = Object.keys(orbsA)
    const classesB = Object.keys(orbsB)

    if(classesA.length < classesB.length){
      return 1
    }else if(classesB.length < classesA.length){
      return -1
    }

    const strA = classesA.join('')
    const strB = classesB.join('')

    if(strA > strB){
      return 1
    }else if(strB > strA){
      return -1
    }

    const totalA = Object.values(orbsA).reduce((prev, val) => prev + val)
    const totalB = Object.values(orbsB).reduce((prev, val) => prev + val)

    if(totalA > totalB){
      return 1
    }else if(totalB > totalA){
      return -1
    }

    return rowA.loadoutItem.displayName - rowB.loadoutItem.displayName
  }
}

customElements.define('di-inventory', Inventory)