import Skills from './combined.js'
import UpgradeData from '../upgradeData.js'
import AdventurerLoadoutObject from '../adventurerLoadoutObject.js'
import { getClassDisplayInfo } from '../adventurerClassInfo.js'

// Convert a skills obj to an array of AdventurerSkills
export function getSkillsForClass(className, levels){
  return getClassDisplayInfo(className).skills.map(skillDef => new AdventurerSkill(skillDef.id, levels[skillDef.id] ?? 0))
}

export default class AdventurerSkill extends AdventurerLoadoutObject{

  _data

  constructor(skillId, level = 1){
    super()
    const baseSkill = Skills[skillId]
    if(!baseSkill){
      throw 'Invalid skillId: ' + skillId
    }
    if(!baseSkill.levelFn){
      throw 'Skill is missing its levelFn: ' + skillId
    }
    this._level = level
    this._baseSkill = baseSkill
    this._data = baseSkill.levelFn(level)
    this._skillPoints = new UpgradeData(baseSkill.skillPoints ?? [1, '...'])
  }

  get level(){
    return this._level
  }

  get displayName(){
    let txt = this.level > 1 ? `L${this.level} ` : ''
    return txt + this._data.displayName
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