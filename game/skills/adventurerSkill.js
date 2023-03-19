import Skills, { all }  from './combined.js'
import _ from 'lodash'

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
    if(!_.isFunction(baseSkill)){
      throw 'Skill is not a function: ' + skillId
    }
    this._level = level
    this._id = skillId
    this._class = baseSkill.group
    this._skill = baseSkill(level)
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
    return this._class
  }

  get id(){
    return this._id
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