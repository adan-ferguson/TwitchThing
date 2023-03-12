import Skills, { all }  from './combined.js'

// Convert a skills obj to an array of AdventurerSkills
export function getSkillsForClass(className){
  debugger
  return Object.keys(Skills[className]).map(skillId => new AdventurerSkill(skillId))
}

export default class AdventurerSkill{

  _skill

  constructor(skillId){
    this._skill = all[skillId]
  }

  get isValid(){
    if(!this._skill){
      return false
    }
    return this.displayName ? true : false
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

  get requiredLevel(){
    return Math.max(0, 5 * (this.index - 3))
  }
}