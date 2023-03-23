import DIElement from '../../diElement.js'
import AdventurerSkillRow from '../../adventurer/adventurerSkillRow.js'
import { adventurerSkillsToRows, makeAdventurerSkillRow } from '../../listHelpers.js'
import { ADVENTURER_CLASS_LIST } from '../../../classDisplayInfo.js'
import AdventurerSkill from '../../../../../game/skills/adventurerSkill.js'

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
      blankFn: () => new AdventurerSkillRow(),
      sortFn: (rowA, rowB) => {
        const skillA = rowA.skill
        const skillB = rowB.skill
        if(skillA.class !== skillB.class){
          return classIndex(skillA.class) - classIndex(skillB.class)
        }
        return skillA.index - skillB.index
      },
      showFiltered: true,
      filterFn: row => {
        if(!this.adventurer || !row.skill){
          return true
        }
        return this.adventurer.loadout.skills
          .filter(s => s)
          .find(skill => skill.id === row.skill.id) ? false : true
      }
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

    const unlocked = adventurer.doc.unlockedSkills
    const rows = []
    for(let id in unlocked){
      const skill = new AdventurerSkill(id, unlocked[id])
      rows.push(new AdventurerSkillRow().setSkill(skill))
    }
    this.listEl.setRows(rows)
  }
}

customElements.define('di-adventurer-edit-skills', Skills)

function classIndex(className){
  return ADVENTURER_CLASS_LIST.findIndex(advClass => advClass.name === className)
}
