import DIElement from '../diElement.js'
import classDisplayInfo from '../../displayInfo/classDisplayInfo.js'
import SkillCard from '../skillCard.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import LoadoutObjectDetails from '../loadoutObjectDetails.js'
import LoadoutObjectInstance from '../../../../game/loadoutObjectInstance.js'

const HTML = `
<di-loadout-row-state></di-loadout-row-state>
<div class="content"></div>
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

  _adventurerSkill
  _adventurerSkillInstance

  constructor(){
    super()
    this.innerHTML = HTML
    this._update()
  }

  get stateEl(){
    return this.querySelector('di-loadout-row-state')
  }

  get skill(){
    return this._options.skill
  }

  set skill(adventurerSkill){
    this.setOptions({ skill: adventurerSkill })
  }

  get adventurerSkill(){
    return this._adventurerSkill
  }

  get adventurerSkillInstance(){
    return this._adventurerSkillInstance
  }

  get contentEl(){
    return this.querySelector('.content')
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
    tooltip.appendChild(new LoadoutObjectDetails().setObject(this.adventurerSkill ?? this.adventurerSkillInstance))
    tooltip.appendChild(wrapContent('Right-click for more info', {
      class: 'right-click subtitle'
    }))

    return tooltip
  }

  _update(){

    if(this._options.item instanceof LoadoutObjectInstance){
      this._adventurerSkillInstance = this._options.item
      this._adventurerSkill = this._adventurerSkillInstance.obj
    }else{
      this._adventurerSkillInstance = null
      this._adventurerSkill = this._options.item
    }

    const skill = this._options.skill
    this.classList.toggle('blank', skill ? false : true)
    this.classList.toggle('idle', this.adventurerSkillInstance ? false : true)
    this.classList.toggle('clickable', false)
    this.classList.toggle('locked', this._options.status !== AdventurerSkillRowStatus.UNLOCKED)
    this.classList.toggle('invalid', !(this._options.valid ?? true))
    this.setTooltip(this.tooltip)

    if(!skill){
      this.contentEl.innerHTML = ''
    }else{
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

    this.stateEl.setOptions({
      loadoutEffectInstance: this.adventurerSkillInstance
    })

    return this
  }
}

customElements.define('di-adventurer-skill-row', AdventurerSkillRow)