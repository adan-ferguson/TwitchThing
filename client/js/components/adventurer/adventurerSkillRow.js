import DIElement from '../diElement.js'
import classDisplayInfo from '../../classDisplayInfo.js'

const HTML = `
<div class="border"></div>
<div class="hit-area"></div>
`

const HIDDEN_HTML = (lvl, orbSvg) => `
<span class="hidden-skill">${lvl} ${orbSvg}</span>
`

const SKILL_HTML = (name, right) => `
<span class="center-contents" style="justify-content: space-between">
  <span>${name}</span>
  <span class="class-identifier">${right}</span>
</span>
`

export const AdventurerSkillRowStatus = {
  UNLOCKED: 0,
  CAN_UNLOCK: 1,
  HIDDEN: 2
}

export default class AdventurerSkillRow extends DIElement{

  _skill

  constructor(){
    super()
    this.innerHTML = HTML
    this._update()
  }

  get skill(){
    return this._skill
  }

  set skill(adventurerSkill){
    this.setSkill(adventurerSkill)
  }

  get contentEl(){
    return this.querySelector('.border')
  }

  get defaultOptions(){
    return {
      status: AdventurerSkillRowStatus.UNLOCKED,
      clickable: false
    }
  }

  setSkill(adventurerSkill){
    this._skill = adventurerSkill
    this._update()
    return this
  }

  _update(){

    this.contentEl.innerHTML = ''
    const skill = this.skill
    this.classList.toggle('blank', skill ? false : true)
    this.classList.toggle('clickable', false)
    this.classList.toggle('locked', this._options.status !== AdventurerSkillRowStatus.UNLOCKED)

    if(!skill){
      return
    }

    const info = classDisplayInfo(skill.class)
    if(this._options.status === AdventurerSkillRowStatus.HIDDEN){
      this.contentEl.innerHTML = HIDDEN_HTML(skill.requiredOrbs, info.icon)
      return
    }

    const icon = info.icon
    this.contentEl.innerHTML = SKILL_HTML(skill.displayName, icon)
    this.classList.toggle('clickable', this._options.clickable)
  }
}

customElements.define('di-adventurer-skill-row', AdventurerSkillRow)