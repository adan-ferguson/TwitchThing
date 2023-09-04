import Adventurer from '../../game/adventurer.js'
import AdventurerSkill from '../../game/skills/adventurerSkill.js'

export function spendAdventurerOrb(advDoc, userDoc, advClass, count){
  const adv = new Adventurer(advDoc)
  count = Math.min(count, adv.unspentOrbs)
  if(!count){
    throw { code: 403, error: 'No orbs to spend.' }
  }
  if(!adv.orbs[advClass]){
    if(Object.keys(adv.orbs) === 3){
      throw { code: 403, error: 'Can not add another advClass.' }
    }
    if(!userDoc.features.advClasses[advClass]){
      throw { code: 403, error: 'User can not use this advClass.' }
    }
    advDoc.orbs[advClass] = 0
  }
  advDoc.orbs[advClass] = advDoc.orbs[advClass] + count
}

export function spendAdventurerSkillPoint(advDoc, skillId){
  const adv = new Adventurer(advDoc)
  const skill = new AdventurerSkill(skillId, advDoc.unlockedSkills[skillId] ?? 0)
  adv.upgradeSkill(skill)
  advDoc.loadout = adv.doc.loadout
  advDoc.unlockedSkills = adv.doc.unlockedSkills
}

export function spendStashedXp(userDoc, advDoc, xp){
  if(xp > userDoc.inventory.stashedXp){
    throw 'Too much!'
  }
  advDoc.xp += xp
  userDoc.inventory.stashedXp -= xp
}