import DIElement from '../diElement.js'
import MonsterItemRow from './monsterItemRow.js'

export default class MonsterLoadout extends DIElement{

  constructor(){
    super()
    this.classList.add('fill-contents', 'flex-rows')
    for(let i = 0; i < 8; i++){
      const itemRow = new MonsterItemRow()
      itemRow.setAttribute('slot-index', i)
      this.appendChild(itemRow)
    }
  }

  get itemRows(){
    return this.querySelectorAll('di-monster-item-row')
  }

  setMonsterInstance(monsterInstance){
    this._monsterInstance = monsterInstance
    this.updateAllRows()
    return this
  }

  updateAllRows(){
    this.itemRows.forEach((row, i) => {
      row.setOptions({
        item: this._monsterInstance.itemInstances[i]
      })
    })
    return this
  }

  advanceTime(ms){
    this.itemRows.forEach(row => {
      row.stateEl.advanceTime(ms)
    })
  }
}

customElements.define('di-monster-loadout', MonsterLoadout)