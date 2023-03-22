import DIElement from './diElement.js'
import { skillPointEntry } from './common.js'
import { skillDisplayInfo } from '../skillDisplayInfo.js'
import { classIcon } from '../classDisplayInfo.js'

const HTML = `
<div class="skill-border">
  <div class="inset-title skill-name"></div>
  <div class="inset-title-right skill-points displaynone"></div>
  <di-effect-details></di-effect-details>
  <div class="extra-details"></div>
</div>
`

export default class SkillCard extends DIElement{

  get nameEl(){
    return this.querySelector('.skill-name')
  }

  get skillPointsEl(){
    return this.querySelector('.skill-points')
  }

  get effectDetailsEl(){
    return this.querySelector('di-effect-details')
  }

  get extraDetailsEl(){
    return this.querySelector('.extra-details')
  }

  setSkill(adventurerSkill, showTooltips = true){

    this.innerHTML = HTML
    this.nameEl.innerHTML = adventurerSkill.displayName + classIcon(adventurerSkill.class)
    // this.skillPointsEl.innerHTML = skillPointEntry(adventurerSkill.skillPoints)
    this.effectDetailsEl.setOptions({ showTooltips }).setEffect(adventurerSkill.effect)

    const sdi = skillDisplayInfo(adventurerSkill)
    if(sdi.extraDetails){
      this.extraDetailsEl.innerHTML = sdi.extraDetails
    }

    return this
  }
}

customElements.define('di-skill-card', SkillCard)