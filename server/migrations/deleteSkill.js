import Adventurers from '../collections/adventurers.js'
import { tryClass } from '../../game/utilFunctions.js'
import AdventurerSkill from '../../game/skills/adventurerSkill.js'

export async function removeInvalidSkills(){
  for(let advDoc of await Adventurers.find()){
    advDoc.loadout.skills = advDoc.loadout.skills.map(sName => {
      return tryClass(AdventurerSkill, [sName]) ? sName : null
    })

    const toDelete = []
    Object.keys(advDoc.unlockedSkills).forEach(sName => {
      if(!tryClass(AdventurerSkill, [sName])){
        toDelete.push(sName)
      }
    })

    toDelete.forEach(sName => delete advDoc.unlockedSkills[sName])

    await Adventurers.save(advDoc)
  }
}