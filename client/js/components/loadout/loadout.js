import LoadoutRow from './loadoutRow.js'
import OrbsData from '../../../../game/orbsData.js'

const HTML = `
<div class="flex-rows">
  <di-orb-row></di-orb-row>
  <di-list></di-list>
</div>
`

export const OrbsDisplayStyles = {
  STANDARD: 0,
  SHOW_MAXIMUM: 1
}

export default class Loadout extends HTMLElement{

  _options = {
    orbsDisplayStyle: OrbsDisplayStyles.STANDARD,
    editable: false
  }

  _orbRow

  _contents

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('fill-contents')

    this._orbRow = this.querySelector('di-orb-row')
    this.list = this.querySelector('di-list')
    this.list.setOptions({
      paginate: false,
      pageSize: 8
    })

    this._rows = []
    for(let i = 0; i < 8; i++){
      this._rows[i] = new LoadoutRow(i)
    }

    this.update()
  }

  get items(){
    return this._rows.map(row => row.item)
  }

  get orbsData(){
    if(this._contents){
      return this._contents.getOrbsData(this.items)
    }
    return new OrbsData()
  }

  get hasChanges(){
    for(let i = 0; i < 8; i++){
      const originalDef = toDef(this._originalItems[i])
      const currentDef = toDef(this.items[i])
      if(originalDef !== currentDef){
        return true
      }
    }
    return false

    function toDef(val){
      if(!val){
        return null
      }
      return val.itemDef || val
    }
  }

  get isValid(){
    // TODO: other checks
    return this.orbsData.isValid ? true : false
  }

  get isFull(){
    return this._rows.every(row => row.item)
  }

  get tooltip(){
    if(!this.loadoutItem?.makeTooltip){
      return ''
    }

    const tooltip = document.createElement('div')
    tooltip.appendChild(this.loadoutItem.makeTooltip())

    if(this.loadoutItem.makeDetails){
      const right = document.createElement('div')
      right.classList.add('right-click')
      right.innerHTML = 'right-click for more info'
      tooltip.appendChild(right)
    }

    return tooltip
  }

  setOptions(options = {}){
    for (let key in options){
      this._options[key] = options[key]
    }
    this.update()
    return this
  }

  setContents(loadoutContents){
    this._contents = loadoutContents
    this._originalItems = [...loadoutContents.loadoutItems]
    for(let i = 0; i < 8; i++){
      this._rows[i].setItem(this._originalItems[i])
    }
    this.update()
  }

  addItem(item){
    for(let i = 0; i < 8; i++){
      if(!this.items[i]){
        this._rows[i].setItem(item)
        this.update()
        return true
      }
    }
    return false
  }

  setItem(index, item){
    this._rows[index].setItem(item)
    this.update()
  }

  swap(index1, index2){
    const item1 = this._rows[index1].item
    this._rows[index1].setItem(this._rows[index2].item)
    this._rows[index2].setItem(item1)
    this.update()
  }

  update(){
    this.updateOrbs()
    this.classList.toggle('editable', this._options.editable)
    this.list.setRows(this._rows)
  }

  updateOrbs(){
    const showMax = this._options.editable || this._options.orbsDisplayStyle === OrbsDisplayStyles.SHOW_MAXIMUM
    this._orbRow.setData(this.loadoutItem?.orbsData, showMax)
  }
}

customElements.define('di-loadout', Loadout)