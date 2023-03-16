import { geometricProgession, inverseGeometricProgression } from './growthFunctions.js'
import { toNumberOfDigits } from './utilFunctions.js'
import AdventurerItem from './adventurerItem.js'
import AdventurerSkill from './skills/adventurerSkill.js'
import _ from 'lodash'
import { unlockedSkillsArray } from './skills/adventurerSkillFns.js'

const XP_BASE = 100
const XP_GROWTH = 200
const XP_GROWTH_PCT = 0.3

const HP_BASE = 40
const HP_GROWTH = 18
const HP_GROWTH_PCT = 0.05

const POWER_BASE = 10
const POWER_GROWTH = 3
const POWER_GROWTH_PCT = 0.05

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
  _items = []
  _skills = []

  constructor(adventurerDoc){
    this._doc = JSON.parse(JSON.stringify(adventurerDoc))
    for(let i = 0; i < 8; i++){
      const slot = adventurerDoc.slots[i]
      this._items[i] = slot?.[i]?.item ? new AdventurerItem(slot[i].item) : null
      this._skills[i] = slot?.[i]?.skill ? new AdventurerSkill(slot[i].skill) : null
    }
  }

  get doc(){
    return { ...this._doc }
  }

  get orbs(){
    return this.doc.orbs
  }

  get name(){
    return this.doc.name
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

  get items(){
    return [...this._items]
  }

  get skills(){
    return [...this._skills]
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
    const usedPoints = _.sum(unlockedSkillsArray(this.doc.unlockedSkills).map(skill => skill.skillPoints ?? 0))
    return Math.max(0, Math.floor(this.level / 5) - usedPoints)
  }

  /**
   * @param skill {AdventurerSkill}
   */
  hasSkillUnlocked(skill){
    return this.doc.unlockedSkills[skill.class]?.[skill.id] ? true : false
  }

  /**
   * @param skill {AdventurerSkill}
   */
  canUnlockSkill(skill){
    if(skill.skillPoints > this.unspentSkillPoints){
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
    return this.orbs[skill.class] >= skill.requiredOrbs
  }

  upgradeSkill(skill){
    if(this.unspentSkillPoints < skill.skillPoints){
      throw 'Not enough skill points to unlock/upgrade skill.'
    }
    if(!this.doc.unlockedSkills[skill.class]){
      this.doc.unlockedSkills[skill.class] = {}
    }
    this.doc.unlockedSkills[skill.class][skill.id] = (this.doc.unlockedSkills[skill.class][skill.id] ?? 0) + 1
  }
}