import { makeEl, wrapContent } from '../../../../../game/utilFunctions.js'
import SkillCard from '../../skillCard.js'
import AdventurerSkill from '../../../../../game/skills/adventurerSkill.js'
import { skillPointEntry } from '../../common.js'
import SimpleModal from '../../simpleModal.js'

export function showUnlockModal(skill, adventurer, onSpend){

  const content = makeEl({
    class: 'skill-unlock-modal-content'
  })

  let buttonHTML
  if(skill.isMaxLevel){
    content.appendChild(new SkillCard().setSkill(skill))
    buttonHTML = 'Max Level'
  }else{
    const isUpgrade = skill.level > 0
    const nextSkill = new AdventurerSkill(skill.id, skill.level + 1)
    if(isUpgrade){
      buttonHTML = 'Upgrade'
      content.appendChild(new SkillCard().setSkill(skill))
      content.appendChild(wrapContent('<i class="fa-solid fa-arrow-down"></i>'))
    }else{
      buttonHTML = 'Unlock'
    }
    content.appendChild(new SkillCard().setSkill(nextSkill))
    buttonHTML += ' ' + skillPointEntry(skill.skillPointsToUpgrade)
  }
  const buttons = [{
    content: buttonHTML,
    fn: () => {
      onSpend(skill)
    },
    disabled: !adventurer.canUpgradeSkill(skill)
  }]
  new SimpleModal(content, buttons).show()
}