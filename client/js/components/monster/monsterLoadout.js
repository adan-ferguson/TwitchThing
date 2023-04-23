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

  setMonsterInstance(monsterInstance){
    debugger
    this._monsterInstance = monsterInstance
    this.querySelectorAll('di-monster-item-row').forEach((row, i) => {
      row.setOptions({
        item: monsterInstance.itemInstances[i]
      })
    })
    return this
  }
}

customElements.define('di-monster-loadout', MonsterLoadout)