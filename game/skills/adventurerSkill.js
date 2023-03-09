import Skills from './combined.js'

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