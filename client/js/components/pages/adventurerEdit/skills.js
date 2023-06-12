import DIElement from '../../diElement.js'
import AdventurerSkillRow from '../../adventurer/adventurerSkillRow.js'
import AdventurerSkill from '../../../../../game/skills/adventurerSkill.js'
import { advClassIndex } from '../../listHelpers.js'
import { featureLocked } from '../../common.js'
import tippyCallout from '../../visualEffects/tippyCallout.js'

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
      pageSize: 14,
      blankFn: () => new AdventurerSkillRow(),
      sortFn: (rowA, rowB) => {
        const skillA = rowA.skill
        const skillB = rowB.skill
        if(skillA.advClass !== skillB.advClass){
          return advClassIndex(skillA.advClass) - advClassIndex(skillB.advClass)
        }
        return skillA.index - skillB.index
      },
      showFiltered: false,
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

  setup(adventurer, featureStatus = 2){
    this.adventurer = adventurer
    const unlocked = adventurer.doc.unlockedSkills
    const rows = []
    let hasSkillUnlocked = false
    for(let id in unlocked){
      hasSkillUnlocked = true
      const skill = new AdventurerSkill(id, unlocked[id])
      rows.push(new AdventurerSkillRow().setOptions({ skill }))
    }
    this.listEl.setRows(rows)
    if(!featureStatus){
      featureLocked(this.listEl, 'Level 5')
    }else if(hasSkillUnlocked && !localStorage.getItem('equipped-skill-callout')){
      tippyCallout(this.listEl.querySelector('di-adventurer-skill-row'), 'Make sure to equip your skills!')
      localStorage.setItem('equipped-skill-callout', true)
    }
  }
}

customElements.define('di-adventurer-edit-skills', Skills)
