import Skills, { all }  from './combined.js'

// Convert a skills obj to an array of AdventurerSkills
export function getSkillsForClass(className){
  return Object.keys(Skills[className]).map(skillId => new AdventurerSkill(skillId))
}

export default class AdventurerSkill{

  _skill

  constructor(skillId, level = 1){
    this._skill = all[skillId]
    this._level = level
  }

  get isValid(){
    if(!this._skill){
      return false
    }
    return this.displayName ? true : false
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