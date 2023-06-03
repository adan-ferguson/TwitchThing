import DIElement from '../diElement.js'
import classDisplayInfo from '../../displayInfo/classDisplayInfo.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import EffectDetails from '../effectDetails.js'
import LoadoutObjectInstance from '../../../../game/loadoutObjectInstance.js'
import ItemDetails from '../itemDetails.js'
import SimpleModal from '../simpleModal.js'
import SkillCard from '../skillCard.js'
import { affectsIcon } from '../common.js'
import { getAbilityDisplayInfoForObj } from '../../displayInfo/abilityDisplayInfo.js'
import { ITEM_ROW_COLORS } from '../../colors.js'
import AdventurerSkill from '../../../../game/skills/adventurerSkill.js'

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
    this.addEventListener('contextmenu', e => {
      if(this.adventurerSkill && this._options.showTooltip && !this._options.noRightClick){
        e.preventDefault()
        const details = new SkillCard().setSkill(this.adventurerSkill)
        new SimpleModal(details).show()
      }
    })
  }

  get name(){
    if(!this.adventurerSkill){
      return ''
    }
    return `${this.adventurerSkill.displayName} ${affectsIcon(this.adventurerSkill)}`.trim()
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
      valid: null,
      showState: false,
      showTooltip: true,
      shouldBeEmpty: false,
      noRightClick: false
    }
  }

  get tooltip(){

    if(!this._options.skill || !this._options.showTooltip || this._options.status === AdventurerSkillRowStatus.HIDDEN){
      return null
    }

    let obj = this.adventurerSkillInstance ?? this.adventurerSkill
    if(obj instanceof AdventurerSkill && obj.level === 0){
      obj = new AdventurerSkill(obj.id, obj.level + 1)
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new EffectDetails().setObject(obj))

    if(!this._options.noRightClick){
      tooltip.appendChild(wrapContent('Right-click for more info', {
        class: 'right-click subtitle'
      }))
    }

    return tooltip
  }

  flash(){
    this.stateEl?.flash()
  }

  _update(){

    if(this._options.skill instanceof LoadoutObjectInstance){
      this._adventurerSkillInstance = this._options.skill
      this._adventurerSkill = this._adventurerSkillInstance.obj
    }else{
      this._adventurerSkillInstance = null
      this._adventurerSkill = this._options.skill
    }

    const skill = this.adventurerSkill
    this.classList.toggle('should-be-empty', this._options.shouldBeEmpty ? true : false)
    this.classList.toggle('blank', skill ? false : true)
    this.classList.toggle('idle', this._options.showState ? false : true)
    this.classList.toggle('clickable', false)
    this.classList.toggle('locked', this._options.status !== AdventurerSkillRowStatus.UNLOCKED)
    this.classList.toggle('invalid', !(this._options.valid ?? true))
    this.classList.toggle('effect-instance', this._adventurerSkillInstance ? true : false)
    this.setAttribute('effect-id', this._adventurerSkillInstance?.uniqueID ?? null)
    this.setTooltip(this.tooltip)

    if(!skill){
      this.contentEl.innerHTML = ''
    }else{
      const info = classDisplayInfo(skill.advClass)
      if(this._options.status === AdventurerSkillRowStatus.HIDDEN){
        this.contentEl.innerHTML = HIDDEN_HTML(skill.requiredOrbs, info.icon)
        return
      }
      const icon = this._options.status === AdventurerSkillRowStatus.UNLOCKED ? info.icon : info.colorlessIcon
      const spd = '' //this._options.showSkillPoints ? skillPointEntry(skill.skillPointsCumulative) : ''
      this.contentEl.innerHTML = SKILL_HTML(this.name, spd, icon)
      this.classList.toggle('clickable', this._options.clickable)
    }

    this.stateEl.setOptions({
      loadoutEffectInstance: this._options.showState ? this.adventurerSkillInstance : false,
      displayStyle: 'skill'
    }).update()

    // const ado = getAbilityDisplayInfoForObj(this.adventurerSkill)
    // if(ado[0]?.type === 'active'){
    //   this.style.borderColor = ITEM_ROW_COLORS.active
    //   this.style.borderWidth = '3rem'
    // }else{
    //   this.style.borderColor = null
    //   this.style.borderWidth = null
    // }

    return this
  }
}

customElements.define('di-adventurer-skill-row', AdventurerSkillRow)