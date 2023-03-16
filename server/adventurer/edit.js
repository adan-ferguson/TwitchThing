import Adventurer from '../../game/adventurer.js'
import AdventurerSkill from '../../game/skills/adventurerSkill.js'

export function spendAdventurerOrb(advDoc, userDoc, advClass){
  const adv = new Adventurer(advDoc)
  if(!adv.unspentOrbs){
    throw { code: 403, error: 'No orbs to spend.' }
  }
  if(!adv.orbs[advClass]){
    if(Object.keys(adv.orbs) === 3){
      throw { code: 403, error: 'Can not add another advClass.' }
    }
    if(!userDoc.features.advClasses[advClass]){
      throw { code: 403, error: 'User can not use this advClass.' }
    }
    advDoc.orbs[advClass] = 1
    return
  }
  advDoc.orbs[advClass]++
}

export function spendAdventurerSkillPoint(advDoc, skillId){
  const adv = new Adventurer(advDoc)
  const skill = new AdventurerSkill(skillId)
  adv.upgradeSkill(skill)
  advDoc.unlockedSkills = adv.doc.unlockedSkills
}