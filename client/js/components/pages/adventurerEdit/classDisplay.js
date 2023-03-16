import DIElement from '../../diElement.js'
import { orbPointIcon } from '../../common.js'
import classDisplayInfo, { ADVENTURER_CLASS_LIST } from '../../../classDisplayInfo.js'
import AdventurerSkillRow, { AdventurerSkillRowStatus } from '../../adventurer/adventurerSkillRow.js'
import { getSkillsForClass } from '../../../../../game/skills/adventurerSkill.js'
import { OrbsTooltip } from '../../orbRow.js'

const HTML = `
<div class="unset">
  <div class="supertitle align-center">Add a Class</div>
  <di-adventurer-edit-class-selector></di-adventurer-edit-class-selector>
  <div class="class-info displaynone">
    <div class="class-name supertitle"></div>
    <div class="description"></div>
    <button class="unlock">Unlock ${orbPointIcon()}</button>
  </div>
</div>
<div class="set flex-rows">
  <div class="class-name supertitle"></div>
  <div class="orb-adder flex-columns">
    <di-orb-row></di-orb-row>
    <button>${orbPointIcon()}<i class="fa-solid fa-plus"></i></button>
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
      const ci = this.classInfoEl
      ci.classList.remove('displaynone')
      ci.querySelector('.class-name').textContent = cdi.displayName
      ci.querySelector('.description').textContent = cdi.description
    })
    this.unlockButton.addEventListener('click', () => {
      if(this.classSelectorEl.selectedClass){
        this.events.emit('spend orb', this.classSelectorEl.selectedClass)
      }
    })
    this.adderButton.addEventListener('click', () => {
      this.events.emit('spend orb', this.advClass)
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
        [this.advClass]: this._adventurer.orbs[this.advClass]
      })
      .setOptions({
        tooltip: OrbsTooltip.NONE
      })
    adder.querySelector('button').classList.toggle('displaynone', this._adventurer.unspentOrbs === 0)
  }

  _setClass(){
    if(this._classSet){
      return
    }
    const setEl = this.querySelector('.set')
    const cdi = classDisplayInfo(this.advClass)
    this.style.color = cdi.color
    setEl.querySelector('.class-name').textContent = cdi.displayName

    const skills = getSkillsForClass(this.advClass)
    const list = setEl.querySelector('.skills-list')
    for(let i = 0; i < 12; i++){
      const skill = skills[i]
      const row = new AdventurerSkillRow().setSkill(skills[i]).setOptions({
        status: skillStatus(this._adventurer, skill),
        showSkillPoints: true
      })
      list.appendChild(row)
    }

    this._classSet = true
  }
}

customElements.define('di-adventurer-edit-class-display', ClassDisplay)

function skillStatus(adventurer, skill){
  if(adventurer.hasSkillUnlocked(skill)){
    return AdventurerSkillRowStatus.UNLOCKED
  }else if(adventurer.canUnlockSkill(skill)){
    return AdventurerSkillRowStatus.CAN_UNLOCK
  }else if(adventurer.canSeeSkill(skill)){
    return AdventurerSkillRowStatus.CANT_UNLOCK
  }else{
    return AdventurerSkillRowStatus.HIDDEN
  }
}