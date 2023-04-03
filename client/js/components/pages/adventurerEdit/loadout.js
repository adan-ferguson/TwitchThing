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
    this.itemSlots.querySelectorAll('di-adventurer-item-row').forEach((row, i) => {
      const slotInfo = loadoutObj.getSlotInfo(true, i)
      row.setOptions({
        item: slotInfo.loadoutItem,
        valid: slotInfo.restrictionsPassed,
        orbs: slotInfo.modifiedOrbsData
      })
    })
    this.skillSlots.querySelectorAll('di-adventurer-skill-row').forEach((row, i) => {
      const slotInfo = loadoutObj.getSlotInfo(false, i)
      row.setOptions({
        skill: slotInfo.loadoutItem,
        valid: slotInfo.restrictionsPassed
      })
    })
  }

  setOptions(options = {}){
    for (let key in options){
      this._options[key] = options[key]
    }
    this.update()
    return this
  }
}

customElements.define('di-adventurer-edit-loadout', Loadout)