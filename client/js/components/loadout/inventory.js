import LoadoutRow from './loadoutRow.js'
import { mergeOptionsObjects } from '../../../../game/utilFunctions.js'
import FighterItemDisplayInfo from '../../fighterItemDisplayInfo.js'
import AdventurerItemInstance from '../../../../game/adventurerItemInstance.js'
import DIElement from '../diElement.js'
import _ from 'lodash'

const HTML = `
<div class="content-rows">
  <div class="content-no-grow inventory-options">
    <div class="input-group">
      Sort By:
      <label><input type="radio" name="sortBy" value="class">Class</label>
    </div>
    <div class="filtering-options require-adventurer">
      <label><input type="checkbox" name="hideOther"> Hide Unequippable</label>
    </div>
  </div>
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

  get defaultOptions(){
    return {
      disabledFn: null,
      select: null,
      // filterFn: null,
      // sortFn: null,
      // adventurer: null
    }
  }

  get sortFn(){
    return SORT_FUNCTIONS[this._filterSortOptions.sortBy]
  }

  filterFn = (el) => {
    return this._options.disabledFn?.(el.loadoutItem.itemInstance) ?? true
    // return this.adventurer ? isCompatible(this.adventurer, el.loadoutItem.itemInstance) : true
  }

  setup(items, adventurer){

    const addRow = (itemDef, count) => {
      const info = new FighterItemDisplayInfo(new AdventurerItemInstance(itemDef))
      const row = new LoadoutRow().setItem(info)
      if(count !== null){
        row.setCount(count)
      }
      loadoutRows.push(row)
      row.addEventListener('click', () => {
        this._selectRow(row)
      })
    }

    this.adventurer = adventurer

    const loadoutRows = []

    if(_.isArray(items)){
      // It's an adventurer loadout
      items.forEach(itemDef => {
        if(itemDef){
          addRow(itemDef)
        }
      })
    }else{
      // It's an inventory items object
      Object.keys(items.basic).forEach(group => {
        Object.keys(items.basic[group]).forEach(name => {
          addRow({ group, name }, items.basic[group][name])
        })
      })
      Object.values(items.crafted).forEach(itemDef => {
        addRow(itemDef)
      })
    }

    this.querySelector('.inventory-options').classList.toggle('displaynone', adventurer ? false : true)
    this._updateSortAndFilter()
    this.list.setRows(loadoutRows)
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
      sortFn: this.sortFn,
      filterFn: this.filterFn,
      showFiltered: !this._filterSortOptions.hideOther
    })
  }

  _selectRow(row){
    this.list.querySelector('.selected')?.classList.remove('selected')
    if(!this._options.select){
      return
    }
    if(row.classList.contains('selected')){
      return
    }
    row.classList.add('selected')
    if(_.isFunction(this._options.select)){
      this._options.select(row)
    }
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