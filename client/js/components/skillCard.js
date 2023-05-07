import DIElement from './diElement.js'
import { classIcon } from '../displayInfo/classDisplayInfo.js'
import { skillPointEntry } from './common.js'

const HTML = `
<div class="obj-border">
  <div class="inset-title skill-name"></div>
  <div class="inset-title-right skill-points displaynone"></div>
  <di-effect-details></di-effect-details>
</div>
`

export default class SkillCard extends DIElement{

  get nameEl(){
    return this.querySelector('.skill-name')
  }

  get skillPointsEl(){
    return this.querySelector('.skill-points')
  }

  get loadoutObjectDetails(){
    return this.querySelector('di-effect-details')
  }

  setSkill(adventurerSkill, showTooltips = true){
    this.innerHTML = HTML
    this.nameEl.innerHTML = adventurerSkill.displayName + classIcon(adventurerSkill.advClass)
    this.skillPointsEl.innerHTML = skillPointEntry(adventurerSkill.skillPointsCumulative)
    this.loadoutObjectDetails.setObject(adventurerSkill)
    return this
  }
}

customElements.define('di-skill-card', SkillCard)