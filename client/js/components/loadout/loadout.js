import LoadoutRow from './loadoutRow.js'
import OrbsData from '../../../../game/orbsData.js'
import { OrbsDisplayStyle } from '../orbRow.js'

const HTML = `
<div class="flex-rows">
  <di-orb-row class="loadout-orb-row"></di-orb-row>
  <di-list></di-list>
</div>
`

export default class Loadout extends HTMLElement{

  _options = {
    orbsDisplayStyle: OrbsDisplayStyle.USED_ONLY,
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

  get loadoutItems(){
    return this._rows.map(row => row.loadoutItem)
  }

  get orbsData(){
    if(this._contents){
      return this._contents.getOrbsData(this.loadoutItems)
    }
    return new OrbsData()
  }

  get hasChanges(){
    for(let i = 0; i < 8; i++){
      const originalDef = this._originalItems[i]
      const currentDef = this.loadoutItems[i]
      if(originalDef !== currentDef){
        return true
      }
    }
    return false
  }

  get isValid(){
    // TODO: other checks
    return this.orbsData.isValid ? true : false
  }

  get isFull(){
    return this._rows.every(row => row.loadoutItem)
  }

  get objs(){
    return this.loadoutItems.map(loadoutItem => loadoutItem?.obj)
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
      if(!this.loadoutItems[i]){
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
    const item1 = this._rows[index1].loadoutItem
    this._rows[index1].setItem(this._rows[index2].loadoutItem)
    this._rows[index2].setItem(item1)
    this.update()
  }

  update(){
    this.updateOrbs()
    this.classList.toggle('editable', this._options.editable)
    this.list.setRows(this._rows)
  }

  updateOrbs(){
    if(!this._contents){
      return
    }
    const style = this._options.editable ? OrbsDisplayStyle.SHOW_MAX : this._options.orbsDisplayStyle
    this._orbRow.setData(this._contents.getOrbsData(this.loadoutItems))
    this._orbRow.setOptions({ style })
  }
}

customElements.define('di-loadout', Loadout)