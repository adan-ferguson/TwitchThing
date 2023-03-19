import DIElement from './diElement.js'
import { skillPointIcon } from './common.js'
import { skillDisplayInfo } from '../skillDisplayInfo.js'

const HTML = `
<div class="skill-border">
  <div class="inset-title skill-name"></div>
  <div class="inset-title-right skill-points">
    <span class="count"></span> ${skillPointIcon()}
  </div>
  <di-effect-details></di-effect-details>
  <div class="extra-details"></div>
</div>
`

export default class SkillCard extends DIElement{

  get nameEl(){
    return this.querySelector('.skill-name')
  }

  get skillPointsCountEl(){
    return this.querySelector('.skill-points .count')
  }

  get effectDetailsEl(){
    return this.querySelector('di-effect-details')
  }

  get extraDetailsEl(){
    return this.querySelector('.extra-details-el')
  }

  setSkill(adventurerSkill, showTooltips = true){
    this.innerHTML = HTML
    this.nameEl.textContent = adventurerSkill.displayName
    this.skillPointsCountEl = adventurerSkill.skillPoints
    this.effectDetailsEl.setOptions({ showTooltips }).setEffect(adventurerSkill.effect)

    const sdi = skillDisplayInfo(adventurerSkill)
    if(sdi.extraDetails){
      this.extraDetailsEl.append(sdi.extraDetails)
    }
  }
}

customElements.define('di-skill-card', SkillCard)