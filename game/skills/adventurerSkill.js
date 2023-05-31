import Skills from './combined.js'
import AdventurerLoadoutObject from '../adventurerLoadoutObject.js'
import { getClassInfo } from '../adventurerClassInfo.js'
import { toDisplayName } from '../utilFunctions.js'

// Convert a skills obj to an array of AdventurerSkills
export function getSkillsForClass(className, levels){
  return getClassInfo(className).skills.map(skillDef => new AdventurerSkill(skillDef.id, levels[skillDef.id] ?? 0))
}

export default class AdventurerSkill extends AdventurerLoadoutObject{

  constructor(skillId, level = 1){
    const baseSkill = Skills[skillId]
    if(!baseSkill){
      throw 'Invalid skillId: ' + skillId
    }

    super(baseSkill.def(level))

    this._level = level
    this._baseSkill = baseSkill
  }

  get level(){
    return this._level
  }

  get displayName(){
    let txt = this.level > 1 ? `L${this.level} ` : ''
    return txt + (this.data.displayName ?? toDisplayName(this._baseSkill.id))
  }

  get advClass(){
    return this._baseSkill.group
  }

  get index(){
    return this._baseSkill.index
  }

  get id(){
    return this._baseSkill.id
  }

  get requiredOrbs(){
    return Math.max(0, 5 * (this.index - 1))
  }

  get skillPoints(){
    return this.data.skillPoints ?? this.level
  }

  get isMaxLevel(){
    return this.data.maxLevel === this.level
  }

  get skillPointsToUpgrade(){
    return new AdventurerSkill(this.id, this.level + 1).skillPoints - this.skillPoints
  }

  withDifferentLevel(level){
    return new AdventurerSkill({ ...this.def, level })
  }
}