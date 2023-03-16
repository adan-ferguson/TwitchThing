import DIElement from '../../diElement.js'
import AdventurerSkillRow from '../../adventurer/adventurerSkillRow.js'
import { adventurerSkillsToRows } from '../../listHelpers.js'

const HTML = `
<div class="content-rows">
  <div class="inset-title">Skills</div>
  <di-list class="skill-style-list"></di-list>
</div>
`

export default class Skills extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.list = this.querySelector('di-list')
    this.list.setOptions({
      pageSize: 15,
      blankFn: () => new AdventurerSkillRow()
    })
  }

  /**
   * @returns {List}
   */
  get listEl(){
    return this.querySelector('di-list')
  }

  setup(adventurer){
    this.adventurer = adventurer
    this.listEl.setRows(adventurerSkillsToRows(adventurer.unlockedSkills))
  }
}

customElements.define('di-adventurer-edit-skills', Skills)