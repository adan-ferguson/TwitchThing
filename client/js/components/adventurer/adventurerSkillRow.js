import DIElement from '../diElement.js'
import classDisplayInfo from '../../classDisplayInfo.js'
import { skillPointEntry } from '../common.js'

const HTML = `
<div class="border"></div>
<div class="hit-area"></div>
`

const HIDDEN_HTML = (lvl, orbSvg) => `
<span class="hidden-skill">${lvl} ${orbSvg}</span>
`

const SKILL_HTML = (name, right, classIcon) => `
<span class="skill-contents">
  <span>${name}</span>
  <span>${right}</span>
  <span class="class-identifier">${classIcon}</span>
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
      clickable: false,
      showSkillPoints: true
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

    const info = classDisplayInfo(skill.advClass)
    if(this._options.status === AdventurerSkillRowStatus.HIDDEN){
      this.contentEl.innerHTML = HIDDEN_HTML(skill.requiredOrbs, info.icon)
      return
    }

    const icon = info.icon
    const spd = '' //this._options.showSkillPoints ? skillPointEntry(skill.skillPointsCumulative) : ''
    this.contentEl.innerHTML = SKILL_HTML(skill.displayName, spd, icon)
    this.classList.toggle('clickable', this._options.clickable)
  }
}

customElements.define('di-adventurer-skill-row', AdventurerSkillRow)