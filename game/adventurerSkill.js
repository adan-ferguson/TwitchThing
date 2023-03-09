import Skills from './skills/combined.js'

export default class AdventurerSkill{

  _skill

  constructor(advClass, skillId){
    this._skill = Skills[advClass]?.[skillId]
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
}