import DIElement from '../diElement.js'
import classDisplayInfo from '../../classDisplayInfo.js'

const HTML = `
<div class="border">
  <span class="name"></span>
  <span class="icon"></span>  
</div>
<div class="hit-area"></div>
`

export default class AdventurerSkillRow extends DIElement{

  _skill

  constructor(){
    super()
    this.innerHTML = HTML
    this._blank()
  }

  get nameEl(){
    return this.querySelector('.name')
  }

  get iconEl(){
    return this.querySelector('.icon')
  }

  get skill(){
    return this._item
  }

  setItem(adventurerSkill){
    this._skill = adventurerSkill
    if(!adventurerSkill){
      this._blank()
    }else{
      const info = classDisplayInfo(adventurerSkill.group)
      this.nameEl.textContent = adventurerSkill.displayName
      this.iconEl.innerHTML = info.icon
      this.classList.remove('blank')
    }
    return this
  }

  _blank(){
    this.nameEl.textContent = ''
    this.iconEl.textContent = ''
    this.classList.add('blank')
  }
}

customElements.define('di-adventurer-skill-row', AdventurerSkillRow)