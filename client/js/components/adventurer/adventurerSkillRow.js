import DIElement from '../diElement.js'
import classDisplayInfo from '../../classDisplayInfo.js'
import { skillPointEntry } from '../common.js'
import LoadoutObjectDetails from '../loadoutObjectDetails.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import SkillCard from '../skillCard.js'

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

  constructor(){
    super()
    this.innerHTML = HTML
    this._update()
  }

  get skill(){
    return this._options.skill
  }

  set skill(adventurerSkill){
    this.setOptions({ skill: adventurerSkill })
  }

  get contentEl(){
    return this.querySelector('.border')
  }

  get defaultOptions(){
    return {
      status: AdventurerSkillRowStatus.UNLOCKED,
      clickable: false,
      showSkillPoints: true,
      skill: null,
      valid: null
    }
  }

  get tooltip(){

    if(!this._options.skill){
      return null
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new SkillCard().setSkill(this._options.skill))
    // tooltip.appendChild(wrapContent('Right-click for more info', {
    //   class: 'right-click subtitle'
    // }))

    return tooltip
  }

  _update(){

    this.contentEl.innerHTML = ''

    const skill = this._options.skill
    this.classList.toggle('blank', skill ? false : true)
    this.classList.toggle('clickable', false)
    this.classList.toggle('locked', this._options.status !== AdventurerSkillRowStatus.UNLOCKED)
    this.classList.toggle('invalid', !(this._options.valid ?? true))
    this.setTooltip(this.tooltip)

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