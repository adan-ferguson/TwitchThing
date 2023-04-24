import Skills from './combined.js'
import UpgradeData from '../upgradeData.js'
import AdventurerLoadoutObject from '../adventurerLoadoutObject.js'
import { getClassInfo } from '../adventurerClassInfo.js'

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
    if(!baseSkill.def.levelFn){
      throw 'Skill is missing its levelFn: ' + skillId
    }

    super(baseSkill.def.levelFn(level))

    this._level = level
    this._baseSkill = baseSkill
    this._skillPoints = new UpgradeData(baseSkill.def.skillPoints ?? [1, '...'])
  }

  get level(){
    return this._level
  }

  get displayName(){
    let txt = this.level > 1 ? `L${this.level} ` : ''
    return txt + super.displayName
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
    return Math.max(0, 5 * (this.index - 2))
  }

  get skillPoints(){
    return this._skillPoints
  }

  get isMaxLevel(){
    return this.skillPoints.maxLevel ? this.skillPoints.maxLevel <= this.level : false
  }

  get skillPointsToUpgrade(){
    return this.skillPoints.get(this.level + 1)
  }

  get skillPointsCumulative(){
    return this.skillPoints.total(this.level)
  }
}