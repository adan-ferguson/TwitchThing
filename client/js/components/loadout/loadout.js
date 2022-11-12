import LoadoutRow from './loadoutRow.js'
import OrbsData from '../../../../game/orbsData.js'
import FighterItemDisplayInfo from '../../fighterItemDisplayInfo.js'
import ConsoleTimer from '../../../../game/consoleTimer.js'

const HTML = `
<di-list></di-list>
`

export default class Loadout extends HTMLElement{

  _options = {
    editable: false,
  }

  _fighterInstance

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('fill-contents')

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

  get isFull(){
    return this._rows.every(row => row.loadoutItem)
  }

  get objs(){
    return this.loadoutItems.map(loadoutItem => loadoutItem?.obj)
  }

  getRow(i){
    return this._rows[i]
  }

  setOptions(options = {}){
    for (let key in options){
      this._options[key] = options[key]
    }
    this.update()
    return this
  }

  setContents(loadoutContents){
    this._originalItems = [...loadoutContents]
    for(let i = 0; i < 8; i++){
      this._rows[i].setItem(this._originalItems[i])
    }
    this.update()
  }

  setFighterInstance(fighterInstance){
    this._fighterInstance = fighterInstance
    this.setContents(fighterInstance.itemInstances.map(ii => ii ? new FighterItemDisplayInfo(ii) : null))
  }

  addItem(item){
    for(let i = 0; i < 8; i++){
      if(!this.loadoutItems[i]){
        this.setItem(i, item)
        this.update()
        return true
      }
    }
    return false
  }

  setItem(index, item){
    if(this._fighterInstance){
      if(item){
        item.itemInstance.owner = this._fighterInstance
      }
    }
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
    this.classList.toggle('editable', this._options.editable)
    this.list.setRows(this._rows)
    this._rows.forEach(loadoutRow => {
      loadoutRow.updateTooltip()
    })
  }

  updateAllRows(){
    this._rows.forEach(loadoutRow => {
      loadoutRow.update()
    })
  }

  advanceTime(ms){
    this._rows.forEach(loadoutRow => {
      loadoutRow.advanceTime(ms)
    })
  }
}

customElements.define('di-loadout', Loadout)