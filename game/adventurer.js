import { geometricProgession, inverseGeometricProgression } from './growthFunctions.js'
import { toNumberOfDigits } from './utilFunctions.js'
import _ from 'lodash'
import AdventurerLoadout from './adventurerLoadout.js'
import AdventurerSkill from './skills/adventurerSkill.js'
import OrbsData from './orbsData.js'

const XP_BASE = 100
const XP_GROWTH = 200
const XP_GROWTH_PCT = 0.18

const HP_BASE = 40
const HP_GROWTH = 18
const HP_GROWTH_PCT = 0.04

const POWER_BASE = 10
const POWER_GROWTH = 3
const POWER_GROWTH_PCT = 0.04

export function advXpToLevel(xp){
  if(xp < XP_BASE){
    return 1
  }
  const lvl = Math.floor(inverseGeometricProgression(XP_GROWTH_PCT, xp - XP_BASE, XP_GROWTH)) + 2
  return advLevelToXp(lvl) <= xp ? lvl : lvl - 1
}

export function advLevelToXp(lvl){
  if(lvl <= 1){
    return 0
  }
  return toNumberOfDigits(
    Math.round(geometricProgession(XP_GROWTH_PCT, lvl - 2, XP_GROWTH)) + XP_BASE,
    3
  )
}

export function adventurerLevelToHp(lvl){
  return HP_BASE + Math.ceil(geometricProgession(HP_GROWTH_PCT, lvl - 1, HP_GROWTH))
}

export function adventurerLevelToPower(lvl){
  return POWER_BASE + Math.ceil(geometricProgession(POWER_GROWTH_PCT, lvl - 1, POWER_GROWTH))
}

export default class Adventurer{

  _doc

  constructor(adventurerDoc){
    this._doc = JSON.parse(JSON.stringify(adventurerDoc))
    this._loadout = new AdventurerLoadout(adventurerDoc)
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
    return this._loadout
  }

  get baseStats(){
    return [
      {
        startingFood: 3
      }
    ]
  }

  get unspentOrbs(){
    const totalOrbs = _.sum(Object.values(this.doc.orbs))
    return Math.max(0, this.level - totalOrbs)
  }

  get unspentSkillPoints(){
    let usedPoints = 0
    Object.keys(this.doc.unlockedSkills).forEach(skillId => {
      const skill = new AdventurerSkill(skillId, this.doc.unlockedSkills[skillId])
      usedPoints += skill.skillPointsCumulative
    })
    return Math.max(0, 1 + Math.floor(this.level / 5) - usedPoints)
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
    const currentLevel = this.doc.unlockedSkills[skill.id] ?? 0
    this.doc.unlockedSkills[skill.id] = currentLevel + 1
  }
}