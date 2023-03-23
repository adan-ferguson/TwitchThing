import FighterItemLoadoutItem from '../../../fighterItemLoadoutItem.js'
import AdventurerItemRow from '../../adventurer/adventurerItemRow.js'
import AdventurerSkillRow from '../../adventurer/adventurerSkillRow.js'

const HTML = `
<div class="adv-items slots">
</div>
<div class="adv-skills slots">
</div>
`

export default class Loadout extends HTMLElement{

  _options = {
    editable: false,
  }

  _fighterInstance

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('fill-contents', 'flex-columns')
    for(let i = 0; i < 8; i++){
      const itemRow = new AdventurerItemRow()
      itemRow.setAttribute('slot-index', i)
      this.itemSlots.appendChild(itemRow)
      const skillRow = new AdventurerSkillRow()
      skillRow.setAttribute('slot-index', i)
      this.skillSlots.appendChild(skillRow)
    }
  }

  get itemSlots(){
    return this.querySelector('.adv-items')
  }

  get skillSlots(){
    return this.querySelector('.adv-skills')
  }

  setLoadout(loadoutObj){
    // this.itemSlots
    this.skillSlots.querySelectorAll('di-adventurer-skill-row').forEach((row, i) => {
      row.setSkill(loadoutObj.skills[i])
    })
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
    this.setContents(fighterInstance.itemInstances.map(ii => ii ? new FighterItemLoadoutItem(ii) : null))
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
      loadoutRow.updateItemRow()
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

customElements.define('di-adventurer-edit-loadout', Loadout)