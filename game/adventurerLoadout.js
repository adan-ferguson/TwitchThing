import AdventurerItem from './adventurerItem.js'
import AdventurerSkill from './skills/adventurerSkill.js'
import OrbsData from './orbsData.js'

export default class AdventurerLoadout{
  
  _items = []
  _skills = []

  constructor(adventurer){
    const loadoutObj = adventurer.doc.loadout
    for(let i = 0; i < 8; i++){
      this._items[i] = loadoutObj.items[i] ? new AdventurerItem(loadoutObj.items[i]) : null
      this._skills[i] = loadoutObj.skills[i] ? new AdventurerSkill(loadoutObj.skills[i]) : null
    }
  }

  get skills(){
    return [...this._skills]
  }

  get items(){
    return [...this._items]
  }

  get usedOrbs(){
    return new OrbsData(this.items.map(item => item?.orbs.usedOrbs || {}))
  }

  get isValid(){
    return true //TODO: validate
  }

  canItemFillSlot(item){
    return true //TODO: slot restrictions
  }

  canSkillFillSlot(skill){
    return true // TODO: slot restrictions
  }

  setSkill(skill, slotIndex){
    this._skills[slotIndex] = skill
  }

  setItem(item, slotIndex){
    this._items[slotIndex] = item
  }
}