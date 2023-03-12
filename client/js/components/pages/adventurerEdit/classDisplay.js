import DIElement from '../../diElement.js'
import { orbPointIcon } from '../../common.js'
import classDisplayInfo, { ADVENTURER_CLASS_LIST } from '../../../classDisplayInfo.js'
import AdventurerSkillRow from '../../adventurer/adventurerSkillRow.js'
import { getSkillsForClass } from '../../../../../game/skills/adventurerSkill.js'

const HTML = `
<div class="unset">
  <div class="class-icon">
    <span class="class-not-selected">?</span>
  </div>
  <div class="name"></div>
  <div class="description">Choose a class</div>
  <select class="class-dropdown"></select>
  <button class="unlock">Unlock 1 ${orbPointIcon()}</button>
</div>
<div class="set">
  <div class="class-name"></div>
  <div class="orb-adder">
    <di-orb-row></di-orb-row>
    <button>+1</button>
  </div>
  <div class="skills-list"></div>
</div>
`

export default class ClassDisplay extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.classDropdown.addEventListener('change', () => {
      const cls = classDisplayInfo(this.classDropdown.value)
      this.querySelector('.class-icon').innerHTML = cls.icon
      this.querySelector('.description').textContent = cls.description
    })
    this.unlockButton.addEventListener('click', () => {
      if(this.classDropdown.value){
        this.events.emit('spend orb', this.classDropdown.value)
      }
    })
    this.adderButton.addEventListener('click', () => {
      this.events.emit('spend orb', this.advClass)
    })
  }

  get advClass(){
    if(!this._adventurer){
      return undefined
    }
    return Object.keys(this._adventurer.doc.orbs)[this._index]
  }

  get classDropdown(){
    return this.querySelector('.class-dropdown')
  }

  get unlockButton(){
    return this.querySelector('.unlock-button')
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
    this.classDropdown.innerHTML = ADVENTURER_CLASS_LIST.map(cls => {
      return `<option value="${cls.advClass}">${cls.displayName}</option>`
    }).join('')
    this.unlockButton.toggleAttribute('disabled', this._adventurer.unspentOrbs === 0)
  }

  _set(){
    this._setClass()
    this.querySelector('.orb-adder di-orb-row').setData({
      [this.advClass]: this._adventurer.orbs[this.advClass]
    })
  }

  _setClass(){
    if(this._classSet){
      return
    }
    const cdi = classDisplayInfo(this.advClass)
    this.style.color = cdi.color
    this.querySelector('.class-name').textContent = cdi.displayName

    const skills = getSkillsForClass(this.advClass)
    const list = this.querySelector('.skills-list')
    for(let i = 0; i < 12; i++){
      const skill = skills[i]
      const row = new AdventurerSkillRow().setSkill(skills[i], {
        status: skillStatus(this._adventurer, skill)
      })
    }

    this._classSet = true
  }
}

customElements.define('di-adventurer-edit-class-display', ClassDisplay)

function skillStatus(adventurer, skill){
  if(adventurer.hasSkillUnlocked(skill)){
    return 'unlocked'
  }else if(adventurer.canUnlockSkill(skill)){
    return 'locked'
  }else{
    return 'hidden'
  }
}