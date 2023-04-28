import AdventurerItemRow from './adventurerItemRow.js'
import AdventurerSkillRow from './adventurerSkillRow.js'
import DIElement from '../diElement.js'
import AdventurerInstance from '../../../../game/adventurerInstance.js'
import Adventurer from '../../../../game/adventurer.js'

const HTML = `
<div class="adv-items slots">
</div>
<div class="adv-skills slots">
</div>
`

export default class AdventurerLoadout extends DIElement{

  _adventurer
  _adventurerInstance

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('fill-contents', 'flex-columns')
    const itemsEl = this.querySelector('.adv-items')
    const skillsEl = this.querySelector('.adv-skills')
    for(let i = 0; i < 8; i++){
      const itemRow = new AdventurerItemRow()
      itemRow.setAttribute('slot-index', i)
      itemsEl.appendChild(itemRow)
      const skillRow = new AdventurerSkillRow()
      skillRow.setAttribute('slot-index', i)
      skillsEl.appendChild(skillRow)
    }
  }

  get itemSlots(){
    return this.querySelectorAll('.adv-items di-adventurer-item-row')
  }

  get skillSlots(){
    return this.querySelectorAll('.adv-skills di-adventurer-skill-row')
  }

  get idle(){
    return this._adventurerInstance ? false : true
  }

  setAdventurer(adventurer){
    if(adventurer instanceof AdventurerInstance){
      this._adventurerInstance = adventurer
      this._adventurer = adventurer.adventurer
    }else if(adventurer instanceof Adventurer){
      this._adventurerInstance = null
      this._adventurer = adventurer
    }else{
      throw 'Invalid arg sent to AdventurerLoadout.setAdventurer'
    }
    this.updateAllRows()
    return this
  }

  updateAllRows(){
    const loadoutObj = this._adventurerInstance ?? this._adventurer.loadout
    this.itemSlots.forEach((row, i) => {
      const slotInfo = loadoutObj.getSlotInfo(0, i)
      row.setOptions({
        item: slotInfo.loadoutItem,
        valid: !slotInfo.restrictionsFailed,
        orbs: slotInfo.modifiedOrbsData
      })
    })
    this.skillSlots.forEach((row, i) => {
      const slotInfo = loadoutObj.getSlotInfo(1, i)
      row.setOptions({
        skill: slotInfo.loadoutItem,
        valid: !slotInfo.restrictionsFailed
      })
    })
    return this
  }

  advanceTime(ms){
    this.itemSlots.forEach(row => {
      row.stateEl.advanceTime(ms)
    })
    this.skillSlots.forEach(row => {
      row.stateEl.advanceTime(ms)
    })
  }
}

customElements.define('di-adventurer-loadout', AdventurerLoadout)