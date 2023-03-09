import DIElement from '../../diElement.js'
import AdventurerSkillRow from '../../adventurer/adventurerSkillRow.js'

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

  // filterFn = row => {
  //   return this.adventurerrow.skill.class.every(cls => this.adventurer.bonuses[cls])
  // }

  setup(adventurer){
    this.adventurer = adventurer
    this.listEl.setRows(adventurerSkillsToRows(adventurer.skills))
  }
}

customElements.define('di-skills', Skills)

function adventurerSkillsToRows(adventurer){

}