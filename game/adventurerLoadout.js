import AdventurerItem from './items/adventurerItem.js'
import AdventurerSkill from './skills/adventurerSkill.js'
import OrbsData from './orbsData.js'
import SlotModifierCollection from './slotModifierCollection.js'
import { isolate } from './utilFunctions.js'
import LoadoutObjectInstance from './loadoutObjectInstance.js'
import Stats from './stats/stats.js'

export default class AdventurerLoadout{

  _objs

  constructor(adventurerDoc){
    this._objs = [[], []]
    const loadoutObj = adventurerDoc.loadout
    for(let i = 0; i < 8; i++){
      this._objs[0][i] = loadoutObj.items[i] ? new AdventurerItem(loadoutObj.items[i]) : null

      const skillName = loadoutObj.skills[i]
      this._objs[1][i] = skillName ? new AdventurerSkill(skillName, adventurerDoc.unlockedSkills[skillName]) : null
    }
  }

  get skills(){
    return [...this._objs[1]]
  }

  get items(){
    return [...this._objs[0]]
  }

  get usedOrbs(){
    const data = []
    for(let i = 0; i < 8; i++){
      const item = this.getSlotInfo(0, i)
      const skill = this.getSlotInfo(1, i)
      data.push(item.modifiedOrbsData?.usedOrbs ?? {}, skill.modifiedOrbsData?.usedOrbs)
    }
    return new OrbsData(data)
  }

  get isValid(){
    const skillIds = {}
    for(let i = 0; i < 8; i++){
      if(this.getSlotInfo(0, i).restrictionsFailed){
        return false
      }
      if(this.getSlotInfo(1, i).restrictionsFailed){
        return false
      }
      const skillId = this.skills[i]?.id
      if(skillId){
        if(skillIds[skillId]){
          return false
        }
        skillIds[skillId] = true
      }
    }
    return true
  }

  get modifiers(){
    if(!this._modifiers){
      this._modifiers = new SlotModifierCollection([this.items, this.skills], 'loadoutModifiers')
    }
    return this._modifiers
  }

  getSlotInfo(col, slot){

    const loadoutItem = this._objs[col][slot]
    const levelAdjust = this.modifiers
      .get(col, slot, 'levelUp')
      .reduce((prev, mod) => prev + mod, 0)
    loadoutItem?.setLevelAdjust(levelAdjust)

    const restrictionsFailed = () => {
      const outgoing = this.modifiers.outgoingModifiers(col, slot)
      if(!outgoing){
        return false
      }
      for(let lm of (loadoutItem?.loadoutModifiers ?? [])){
        if(lm.subjectKey === 'neighbouring' && lm.restrictions && (slot === 0 || slot === 7)){
          return true
        }
      }
      for(let i in outgoing){
        for(let j in outgoing[i]){
          const restrictions = isolate(outgoing[i][j], 'restrictions')
          for(let restriction of restrictions){
            if(restrictionFailed(this._objs[i][j], restriction, i, j)){
              return true
            }
          }
        }
      }
      return false
    }

    const ret = { loadoutItem }

    if(loadoutItem?.orbs){
      const modOrbs = this.modifiers.get(col, slot, 'orbs')
      ret.modifiedOrbsData = new OrbsData([loadoutItem.orbs, ...modOrbs])
    }

    const sourceRestrictions = this.modifiers.get(col, slot, 'restrictions')
    ret.causedRestrictionFailure = sourceRestrictions.find(restriction => {
      if(restriction.empty){
        ret.shouldBeEmpty = true
      }
      return restrictionFailed(loadoutItem, restriction, col, slot)
    }) ? true : false

    ret.restrictionsFailed = restrictionsFailed()

    return ret
  }

  /**
   * Could this loadoutObject be placed in this slot without violating a restriction?
   * @param col
   * @param loadoutObject
   * @param slot
   * @returns {boolean}
   */
  canFillSlot(col, slot, loadoutObject){

    const cachedObjs = [[...this._objs[0]],[...this._objs[1]]]
    const cachedMods = this._modifiers

    this.setSlot(col, slot, loadoutObject)
    const slotInfo = this.getSlotInfo(col, slot)

    this._objs = cachedObjs
    this._modifiers = cachedMods

    return !slotInfo.causedRestrictionFailure && !slotInfo.restrictionsFailed
  }

  setSlot(col, row, loadoutObject){
    this._objs[col][row] = loadoutObject instanceof LoadoutObjectInstance ? loadoutObject.obj : loadoutObject
    this._modifiers = null
  }
}

function restrictionFailed(obj, restriction, col, row){
  col = parseInt(col)
  row = parseInt(row)
  if(restriction.empty){
    return obj ? true : false
  }
  if(restriction.slot){
    return row !== restriction.slot - 1
  }
  if(restriction.hasAbility){
    return !obj || obj.abilities.every(ability => !ability.trigger === restriction.hasAbility)
  }
  if(restriction.hasStat){
    return !obj || !new Stats(obj.stats).has(restriction.hasStat)
  }
  return false
}