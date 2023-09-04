import DIElement from '../../diElement.js'
import { coloredIcon, featureLocked } from '../../common.js'
import classDisplayInfo, { ADVENTURER_CLASS_LIST } from '../../../displayInfo/classDisplayInfo.js'
import AdventurerSkillRow, { AdventurerSkillRowStatus } from '../../adventurer/adventurerSkillRow.js'
import { getSkillsForClass } from '../../../../../game/skills/adventurerSkill.js'
import { OrbsTooltip } from '../../orbRow.js'
import { ICON_SVGS } from '../../../assetLoader.js'
import tippyCallout from '../../visualEffects/tippyCallout.js'
import { showUnlockModal } from './unlockModal.js'
import { htmlToEl, makeEl, wrapContent } from '../../../../../game/utilFunctions.js'

const HTML = `
<div class="unset">
  <div class="supertitle align-center">Add a Class</div>
  <di-adventurer-edit-class-selector></di-adventurer-edit-class-selector>
  <div class="click-preview" style="text-align: center;">^ Choose one to preview</div>
  <div class="class-info displaynone">
    <div class="class-name supertitle"></div>
    <div class="description"></div>
    <button class="unlock">Unlock for 1${ICON_SVGS.orbAdd}</button>
  </div>
</div>
<div class="set flex-rows">
  <div class="class-name supertitle"></div>
  <div class="orb-adder flex-columns">
    <di-orb-row></di-orb-row>
    <button>${ICON_SVGS.orbAdd}</button>
  </div>
  <div class="skills-list"></div>
</div>
`

export default class ClassDisplay extends DIElement{

  constructor(){
    super()
    this.classList.add('fill-contents')
    this.innerHTML = HTML
    this.classSelectorEl.events.on('select', cdi => {
      this.querySelector('.click-preview')?.remove()
      const ci = this.classInfoEl
      ci.classList.remove('displaynone')
      ci.querySelector('.class-name').textContent = cdi.displayName
      ci.querySelector('.description').innerHTML = cdi.description
    })
    this.unlockButton.addEventListener('click', e => {
      if(this.classSelectorEl.selectedClass){
        this.events.emit('spend orb', {
          className: this.classSelectorEl.selectedClass,
          count: e.shiftKey ? 5 : 1,
        })
      }
    })
    this.adderButton.addEventListener('click', e => {
      this.events.emit('spend orb', {
        className: this.advClass,
        count: e.shiftKey ? 5 : 1,
      })
    })
  }

  get classInfoEl(){
    return this.querySelector('.class-info')
  }

  get advClass(){
    if(!this._adventurer){
      return undefined
    }
    return Object.keys(this._adventurer.doc.orbs)[this._index]
  }

  get classSelectorEl(){
    return this.querySelector('di-adventurer-edit-class-selector')
  }

  get unlockButton(){
    return this.querySelector('button.unlock')
  }

  get adderButton(){
    return this.querySelector('.orb-adder button')
  }

  setup(user, adventurer, index){
    this._user = user
    this._adventurer = adventurer
    this._index = index
    this.update()
    if(user.features.spendPoints === 1){
      tippyCallout(this.adderButton, 'Click me to gain more fighter orbs so you can equip both swords')
      user.features.spendPoints = 2
    }
    return this
  }

  update(){
    const blank = Object.keys(this._adventurer.doc.orbs).length < this._index
    this.classList.toggle('displaynone', blank)
    if(blank){
      return
    }
    const set = this.advClass ? true : false
    this.querySelector('.unset').classList.toggle('displaynone', set)
    this.querySelector('.set').classList.toggle('displaynone', !set)
    if(!this.advClass){
      this._unset()
    }else{
      this._set()
    }
  }

  _unset(){
    this.classSelectorEl.setClasses(ADVENTURER_CLASS_LIST.filter(cls => {
      return !this._adventurer.orbs[cls.name] && this._user.features.advClasses[cls.name]
    }))
    this.unlockButton.toggleAttribute('disabled', this._adventurer.unspentOrbs === 0)
  }

  _set(){
    this._setClass()
    const adder = this.querySelector('.orb-adder')
    adder.querySelector('di-orb-row')
      .setData({
        [this.advClass]: this._adventurer.doc.orbs[this.advClass]
      })
      .setOptions({
        tooltip: OrbsTooltip.NONE
      })
    adder.querySelector('button').classList.toggle('displaynone', this._adventurer.unspentOrbs === 0)

    const skills = getSkillsForClass(this.advClass, this._adventurer.doc.unlockedSkills)
    const list = this.querySelector('.skills-list')
    list.innerHTML = ''
    for(let i = 0; i < 12; i++){
      const skill = skills[i]
      const status = skillStatus(this._adventurer, skill)
      const row = new AdventurerSkillRow().setOptions({
        status,
        skill: skills[i],
        clickable: true,
        noRightClick: true
      })
      row.addEventListener('click', () => {
        if(status !== AdventurerSkillRowStatus.HIDDEN){
          this._showUnlockModal(skill)
        }
      })
      row.addEventListener('contextmenu', e => {
        if(status !== AdventurerSkillRowStatus.HIDDEN){
          this._showUnlockModal(skill)
          e.preventDefault()
        }
      })
      const rowRow = makeEl({
        class: 'skill-row-row'
      })
      const icon = coloredIcon('check', '#92eac6', status === AdventurerSkillRowStatus.UNLOCKED ? '' : 'hidden')
      rowRow.append(row, htmlToEl(icon))
      list.appendChild(rowRow)
    }

    if(!this._user.features.skills){
      featureLocked(list, 'Level 5')
    }
  }

  _setClass(){
    if(this._classSet){
      return
    }
    const setEl = this.querySelector('.set')
    const cdi = classDisplayInfo(this.advClass)
    this.style.color = cdi.color
    setEl.querySelector('.class-name').textContent = cdi.displayName
    this._classSet = true
  }

  _showUnlockModal(skill){
    showUnlockModal(skill, this._adventurer, s => {
      this.events.emit('spend skill points', s)
    })
  }
}

customElements.define('di-adventurer-edit-class-display', ClassDisplay)

function skillStatus(adventurer, skill){
  if(!skill){
    return AdventurerSkillRowStatus.HIDDEN
  }else if(adventurer.hasSkillUnlocked(skill)){
    return AdventurerSkillRowStatus.UNLOCKED
  }else if(adventurer.canSeeSkill(skill)){
    return AdventurerSkillRowStatus.CAN_UNLOCK
  }else{
    return AdventurerSkillRowStatus.HIDDEN
  }
}