import { geometricProgession, inverseGeometricProgression } from './growthFunctions.js'
import { toNumberOfDigits } from './utilFunctions.js'
import AdventurerItem from './adventurerItem.js'
import AdventurerSkill from './skills/adventurerSkill.js'
import skillsObjToArrayOfCls from './skills/skillsObjToArrayOfCls.js'
import { sum } from 'lodash'

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
    this._doc = adventurerDoc
    for(let i = 0; i < 8; i++){
      const slot = adventurerDoc.slots[i]
      this._items[i] = slot?.[i]?.item ? new AdventurerItem(slot[i].item) : null
      this._skills[i] = slot?.[i]?.skill ? new AdventurerSkill(slot[i].skill) : null
    }
  }

  get doc(){
    return { ...this._doc }
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
    const totalOrbs = sum(...Object.values(this.doc.orbs))
    return Math.max(0, this.level - totalOrbs)
  }

  get unspentSkillPoints(){
    const usedPoints = sum(...skillsObjToArrayOfCls(this.doc.skills).map(skill => skill.skillPoints))
    return Math.max(0, Math.floor(this.level / 5) - usedPoints)
  }
}