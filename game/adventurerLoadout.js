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
    const data = []
    for(let i = 0; i < 8; i++){
      const item = this.getSlotInfo(true, i)
      const skill = this.getSlotInfo(false, i)
      data.push(item.modifiedOrbs ?? {}, skill.modifiedOrbs)
    }
    return new OrbsData(data)
  }

  get isValid(){
    try {
      validateLoadoutRestrictions(this.items, this.skills)
    }catch(ex){
      return false
    }
    return true
  }

  getSlotInfo(isItem, slot){
    const loadoutItem = (isItem ? this.items : this.skills)[slot]
    const loadoutModifiers = this._getLoadoutModifiers(isItem, slot)
    return {
      modifiedOrbs: {},
      restrictionsPassed: true,
      loadoutItem
    }
  }

  /**
   * Could this loadoutObject be placed in this slot without violating a restriction?
   * @param isItem
   * @param loadoutObject
   * @param slot
   * @returns {boolean}
   */
  canFillSlot(isItem, loadoutObject, slot){
    const oldObject = this._getLoadoutObject(isItem, slot)
    this.setSlot(isItem, loadoutObject, slot)
    const slotInfo = this.getSlotInfo(isItem, slot)
    this.setSlot(isItem, oldObject, slot)
    return slotInfo.restrictionsPassed
  }

  setSlot(isItem, loadoutObject, slot){
    this._objArray(isItem)[slot] = loadoutObject
  }

  _getLoadoutObject(isItem, slot){
    return this._objArray(isItem)[slot]
  }

  _getLoadoutModifiers(isItem, slot){
    const modifiers = []
    for(let i = 0; i < 8; i++){

    }
    return modifiers
  }

  _objArray(isItem){
    return isItem ? this._items : this._skills
  }
}

function validateLoadoutRestrictions(items, skills){

  debugger

  for(let i = 0; i < 8; i++){
    checkRestrictions(true, i)
    checkRestrictions(false, i)
  }

  function checkRestrictions(isItem, slotIndex){
    const obj = (isItem ? items : skills)[slotIndex]
    if(!obj){
      return
    }
    for(let subjectKey in obj.loadoutRestrictions){
      const subjects = getSubjects(isItem, slotIndex, subjectKey)
      subjects
        .filter(s => s)
        .forEach(loadoutObject => validate(loadoutObject, obj.loadoutRestrictions[subjectKey], slotIndex))
    }
  }

  /**
   * @param isItem
   * @param slotIndex
   * @param subjectKey
   * @return [AdventurerLoadoutObject]
   */
  function getSubjects(isItem, slotIndex, subjectKey){
    const same = isItem ? items : skills
    const other = isItem ? skills: items
    if(subjectKey === 'self'){
      return [same[slotIndex]]
    }
    if(subjectKey === 'attached'){
      return [other[slotIndex]]
    }
    if(subjectKey === 'neighbour'){
      return [same[slotIndex - 1], same[slotIndex - 1]]
    }
  }

  function validate(loadoutObject, restriction, slotIndex){
    for(let restrictionKey in restriction){
      if(restrictionKey === 'slot'){
        if(slotIndex + 1 !== restriction[restrictionKey]){
          throw 'Slot restriction not met'
        }
      }else if(restrictionKey === 'empty'){
        if(loadoutObject){
          throw 'Empty restriction not met'
        }
      }
    }
  }
}