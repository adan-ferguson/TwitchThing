import AdventurerItemRow from './adventurerItemRow.js'
import AdventurerSkillRow from './adventurerSkillRow.js'
import DIElement from '../diElement.js'
import AdventurerInstance from '../../../../game/adventurerInstance.js'
import { subjectKeyForLoadoutObject } from '../../subjectClientFns.js'
import { getMatchingSlots } from '../../../../game/subjectFns.js'
import { flash } from '../../animations/simple.js'
import { FLASH_COLORS } from '../../colors.js'

const HTML = `
<div class="adv-items slots">
</div>
<div class="adv-skills slots">
</div>
`

export default class AdventurerLoadout extends DIElement{

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

  get defaultOptions(){
    return {
      showState: false
    }
  }

  setAdventurer(adventurer){
    this._adventurerInstance = adventurer instanceof AdventurerInstance ? adventurer : new AdventurerInstance(adventurer, { idle: true })
    this.updateAllRows()
    return this
  }

  updateAllRows(){
    this.itemSlots.forEach((row, i) => {
      const slotInfo = this._adventurerInstance.getSlotInfo(0, i)
      row.setOptions({
        item: slotInfo.loadoutItem,
        valid: !slotInfo.restrictionsFailed,
        orbs: slotInfo.modifiedOrbsData,
        showState: this._options.showState,
        shouldBeEmpty: slotInfo.shouldBeEmpty
      }, true)
    })
    this.skillSlots.forEach((row, i) => {
      const slotInfo = this._adventurerInstance.getSlotInfo(1, i)
      row.setOptions({
        skill: slotInfo.loadoutItem,
        valid: !slotInfo.restrictionsFailed,
        showState: this._options.showState,
        shouldBeEmpty: slotInfo.shouldBeEmpty
      }, true)
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

  flashAffectedSlots(col, row){
    const { loadoutItem } = this._adventurerInstance.getSlotInfo(col, row)
    if(!loadoutItem){
      return
    }
    const subjectKey = subjectKeyForLoadoutObject(loadoutItem.obj)
    if(!subjectKey || subjectKey === 'self'){
      return
    }
    const matches = getMatchingSlots(col, row, subjectKey)
    matches
      .forEach(({ col, row }) => {
        flash(this._getRow(col, row), FLASH_COLORS.active)
      })
  }

  _getRow(col, row){
    return this[col === 0 ? 'itemSlots' : 'skillSlots'][row]
  }
}

customElements.define('di-adventurer-loadout', AdventurerLoadout)