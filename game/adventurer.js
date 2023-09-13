import { geometricProgression } from './growthFunctions.js'
import _ from 'lodash'
import AdventurerLoadout from './adventurerLoadout.js'
import AdventurerSkill from './skills/adventurerSkill.js'
import OrbsData from './orbsData.js'
import AdventurerXpCalculator from './adventurerXpCalculator.js'

const STAT_GROWTH_PCT = 0.0575

const HP_BASE = 30
const HP_GROWTH = 7
const HP_GROWTH_PCT = STAT_GROWTH_PCT

const POWER_BASE = 5
const POWER_GROWTH = 1
const POWER_GROWTH_PCT = STAT_GROWTH_PCT

/**
 * @param xp
 * @returns {number}
 */
export function advXpToLevel(xp){
  return AdventurerXpCalculator.xpToLevel(xp)
}

export function advLevelToXp(lvl){
  return AdventurerXpCalculator.levelToXp(lvl)
}

export function adventurerLevelToHp(lvl){
  return HP_BASE + Math.ceil(geometricProgression(HP_GROWTH_PCT, lvl - 1, HP_GROWTH))
}

export function adventurerLevelToPower(lvl){
  return POWER_BASE + Math.ceil(geometricProgression(POWER_GROWTH_PCT, lvl - 1, POWER_GROWTH))
}

export default class Adventurer{

  _doc

  constructor(adventurerDoc){
    this._doc = JSON.parse(JSON.stringify(adventurerDoc))
  }

  get id(){
    return this.doc._id
  }

  get doc(){
    return { ...this._doc }
  }

  get orbs(){
    return this.doc.orbs
  }

  /**
   * @returns {OrbsData}
   */
  get orbsData(){
    return new OrbsData(this.loadout.usedOrbs, this.doc.orbs)
  }

  get name(){
    return this.doc.name
  }

  get displayName(){
    return this.name
  }

  get level(){
    return advXpToLevel(this.doc.xp)
  }

  get baseHp(){
    return adventurerLevelToHp(this.level)
  }

  get basePower(){
    return adventurerLevelToPower(this.level)
  }

  get loadout(){
    if(!this._loadout){
      this._loadout = new AdventurerLoadout(this)
    }
    return this._loadout
  }

  get unspentOrbs(){
    const totalOrbs = _.sum(Object.values(this.doc.orbs))
    return Math.max(0, this.level - totalOrbs)
  }

  get unspentSkillPoints(){
    let usedPoints = 0
    Object.keys(this.doc.unlockedSkills).forEach(skillId => {
      const skill = new AdventurerSkill(skillId, this.doc.unlockedSkills[skillId])
      usedPoints += skill.skillPoints
    })
    return Math.max(0, Math.floor(this.level / 5) - usedPoints)
  }

  get xp(){
    return this._doc.xp
  }

  set xp(val){
    this._doc.xp = val
  }

  get deepestFloor(){
    return this._doc.accomplishments.deepestFloor
  }

  get isValid(){
    return this.orbsData.isValid && this.loadout.isValid
  }

  /**
   * @param skill {AdventurerSkill}
   */
  hasSkillUnlocked(skill){
    return this.doc.unlockedSkills[skill.id] ? true : false
  }

  /**
   * @param skill {AdventurerSkill}
   */
  canUpgradeSkill(skill){
    if(skill.isMaxLevel){
      return false
    }
    if(this.unspentSkillPoints < skill.skillPointsToUpgrade){
      return false
    }
    if(!this.canSeeSkill(skill)){
      return false
    }
    return true
  }

  /**
   * Could unlock it if they had enough SP.
   * @param skill
   */
  canSeeSkill(skill){
    return this.orbs[skill.advClass] >= skill.requiredOrbs
  }

  upgradeSkill(skill){
    if(!this.canUpgradeSkill(skill)){
      throw 'Can not upgrade skill'
    }
    this.doc.unlockedSkills[skill.id] = skill.level + 1
    // if(skill.level === 0){
    //   this.loadout.addSkillToEmptySlot(skill.id)
    // }
    this._uncacheLoadout()
  }

  _uncacheLoadout(){
    if(this._loadout){
      // TODO: this sucks
      this._loadout._serialize()
      this._loadout = null
    }
  }
}