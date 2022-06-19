import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import DIForm from '../../form.js'
import fizzetch from '../../../fizzetch.js'
import zones from '../../../../../game/zones.js'

const HTML = `
<div class="content-well stuff fill-contents"></div>
`

export default class DungeonPickerPage extends Page{

  form

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
    this.classList.add('flex-no-grow')

    this.form = new DIForm({
      async: true,
      action: `/game/adventurer/${this.adventurerID}/enterdungeon`,
      submitText: 'Go!',
      success: ({ dungeonRun }) => this.redirectTo(new DungeonPage(dungeonRun._id))
    })

    this.querySelector('.stuff').appendChild(this.form)
  }

  get titleText(){
    return this.adventurer.name + ' - Entering Dungeon'
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  async load(_){

    const { adventurer, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonpicker`)
    if(error){
      return error
    }

    this.adventurer = adventurer
    const slider = this.form.addInput({
      label: 'Select starting floor',
      name: 'startingFloor',
      type: 'range',
      min: 1,
      max: this.user.accomplishments.deepestFloor,
      value: adventurer.accomplishments.deepestFloor
    })
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )