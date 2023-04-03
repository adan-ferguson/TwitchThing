import DIElement from './diElement.js'
import { classIcon } from '../classDisplayInfo.js'
import { skillPointEntry } from './common.js'

const HTML = `
<div class="skill-border">
  <div class="inset-title skill-name"></div>
  <div class="inset-title-right skill-points"></div>
  <di-loadout-object-details></di-loadout-object-details>
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
    return this.querySelector('di-loadout-object-details')
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