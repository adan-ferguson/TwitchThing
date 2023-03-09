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

  setup(adventurer){

  }
}

customElements.define('di-skills', Skills)