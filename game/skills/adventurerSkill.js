import Skills, { all }  from './combined.js'

// Convert a skills obj to an array of AdventurerSkills
export function getSkillsForClass(className, levels){
  return Object.keys(Skills[className]).map(skillId => new AdventurerSkill(skillId, levels[skillId] ?? 0))
}

export default class AdventurerSkill{

  _data

  constructor(skillId, level = 1){
    const baseSkill = all[skillId]
    if(!baseSkill){
      throw 'Invalid skillId: ' + skillId
    }
    if(!baseSkill.levelFn){
      throw 'Skill is missing its levelFn: ' + skillId
    }
    this._level = level
    this._id = skillId
    this._class = baseSkill.group
    this._data = baseSkill.levelFn(level)
  }

  get data(){
    return this._data
  }

  get level(){
    return this._level
  }

  get displayName(){
    let txt = this.level > 1 ? `L${this.level} ` : ''
    return txt + this._data.displayName
  }

  get advClass(){
    return this._class
  }

  get id(){
    return this._id
  }

  get index(){
    return parseInt(this.id.match(/(\d+)$/)[1])
  }

  get requiredOrbs(){
    return Math.max(0, 5 * (this.index - 2))
  }
}