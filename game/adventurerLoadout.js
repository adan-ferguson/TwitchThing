import AdventurerItem from './adventurerItem.js'
import AdventurerSkill from './skills/adventurerSkill.js'
import OrbsData from './orbsData.js'

export default class AdventurerLoadout{
  
  _items = []
  _skills = []

  constructor(loadoutObj){
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
      data.push(item.modifiedOrbsData?.usedOrbs ?? {}, skill.modifiedOrbsData?.usedOrbs)
    }
    return new OrbsData(data)
  }

  get isValid(){
    for(let i = 0; i < 8; i++){
      if(!this.getSlotInfo(true, i).restrictionsPassed){
        return false
      }
      if(!this.getSlotInfo(false, i).restrictionsPassed){
        return false
      }
    }
    return true
  }

  getSlot(isItem, slot){
    return (isItem ? this.items : this.skills)[slot]
  }

  getSlotInfo(isItem, slot){
    const applicableLoadoutModifiers = this._loadoutModifiersFor(isItem, slot)
    const loadoutItem = this.getSlot(isItem, slot)
    let modifiedOrbsData = null
    if(loadoutItem?.orbs){
      const modOrbs = applicableLoadoutModifiers.orbs ?? []
      modifiedOrbsData = new OrbsData([loadoutItem.orbs, ...modOrbs])
    }
    const restrictionsPassed = (applicableLoadoutModifiers?.restrictions ?? []).every(restriction => {
      if(restriction.slot){
        return slot === restriction.slot - 1
      }
      if(restriction.empty){
        return loadoutItem ? false : true
      }
      return false
    })
    return {
      modifiedOrbsData,
      restrictionsPassed,
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
  canFillSlot(isItem, slot, loadoutObject){
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

  _loadoutModifiersFor(isItem, slot){
    const modifiersObj = {}
    const addModifiersFrom = (isItem2, slot2) => {
      const obj = this.getSlot(isItem2, slot2)
      if(!obj?.loadoutModifiers){
        return
      }
      for(let subjectKey in obj.loadoutModifiers){
        if(subjectMatch(isItem2, slot2, isItem, slot, subjectKey)){
          for(let restrictionKey in obj.loadoutModifiers[subjectKey]){
            if(!modifiersObj[restrictionKey]){
              modifiersObj[restrictionKey] = []
            }
            modifiersObj[restrictionKey].push(obj.loadoutModifiers[subjectKey][restrictionKey])
          }
        }
      }
    }
    for(let i = 0; i < 8; i++){
      addModifiersFrom(true, i)
      addModifiersFrom(false, i)
    }
    return modifiersObj
  }

  _objArray(isItem){
    return isItem ? this._items : this._skills
  }
}

/**
 * @param sourceIsItem
 * @param sourceSlot
 * @param targetIsItem
 * @param targetSlot
 * @param subjectKey
 * @return [AdventurerLoadoutObject]
 */
function subjectMatch(sourceIsItem, sourceSlot, targetIsItem, targetSlot, subjectKey){
  const sameType = sourceIsItem === targetIsItem
  const sameSlot = sourceSlot === targetSlot
  if(subjectKey === 'self'){
    return sameType && sameSlot
  }
  if(subjectKey === 'attached'){
    return !sameType && sameSlot
  }
  if(subjectKey === 'neighbour'){
    return sameType && Math.abs(sourceSlot - targetSlot) === 1
  }
  if(subjectKey === 'allItems'){
    return targetIsItem
  }
  return false
}