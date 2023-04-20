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

  setLoadout(loadoutObj){
    this._monsterInstance = loadoutObj.monsterInstance
    this.querySelectorAll('di-monster-item-row').forEach((row, i) => {
      row.setOptions({
        item: loadoutObj.items[i]
      })
    })
    return this
  }
}

customElements.define('di-monster-loadout', MonsterLoadout)