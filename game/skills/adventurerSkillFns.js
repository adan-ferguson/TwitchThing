import AdventurerSkill from './adventurerSkill.js'

export function unlockedSkillsArray(unlockedSkillsObj){
  const skills = []
  for(let id in unlockedSkillsObj){
    skills.push(new AdventurerSkill(id, unlockedSkillsObj[id]))
  }
  return skills
}