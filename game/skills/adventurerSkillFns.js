import Skills from './combined.js'
import AdventurerSkill from './adventurerSkill.js'

export function unlockedSkillsArray(unlockedSkillsObj){
  const skills = []
  for(let cls in unlockedSkillsObj){
    for(let id in unlockedSkillsObj[cls]){
      skills.push(new AdventurerSkill(id))
    }
  }
  return skills
}