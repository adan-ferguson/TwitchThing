import Skills, { all }  from './combined.js'
import { toArray } from '../utilFunctions.js'

// Convert a skills obj to an array of AdventurerSkills
export function getSkillsForClass(className){
  return Object.keys(Skills[className]).map(skillId => new AdventurerSkill(skillId))
}

export default class AdventurerSkill{

  _skill

  constructor(skillId, level = 1){
    const baseSkill = all[skillId]
    if(!baseSkill){
      throw 'Invalid skillId: ' + skillId
    }
    if(!baseSkill.levelFn){
      throw 'Skill is missing a levelFn: ' + skillId
    }
    this._level = level
    this._skill = {
      ...baseSkill,
      ...baseSkill.levelFn(level)
    }
    delete this._skill.levelFn
  }

  get skillData(){
    return this._skill
  }

  get level(){
    return this._level
  }

  get displayName(){
    return this._skill.displayName ?? ''
  }

  get class(){
    return this._skill.group
  }

  get id(){
    return this._skill.name
  }

  get index(){
    return this.id.match(/(\d+)$/)[1]
  }

  get skillPoints(){
    return this.baseSkillPoints * this.level
  }

  get baseSkillPoints(){
    if(this.index <= 5){
      return 1
    }else if(this.index <= 9){
      return 2
    }else{
      return 3
    }
  }

  get requiredOrbs(){
    return Math.max(0, 5 * (this.index - 3))
  }
}