import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import DIForm from '../../form.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="content-columns">
    <div class="content-well floor-picker fill-contents">
        <di-floor-slider></di-floor-slider>
    </div>
    <div class="content-well stuff">
    </div>
</div>
`

export default class DungeonPickerPage extends Page{

  _formEl

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
    this.floorSlider = this.querySelector('di-floor-slider')
    this._formEl = new DIForm({
      async: true,
      action: `/game/adventurer/${this.adventurerID}/enterdungeon`,
      submitText: 'Go!',
      success: ({ dungeonRun }) => this.redirectTo(new DungeonPage(dungeonRun._id)),
      extraData: () => ({ startingFloor: this.floorSlider.value })
    })
    this.querySelector('.stuff').appendChild(this._formEl)
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
    this.floorSlider.setOptions({
      max: adventurer.accomplishments.deepestFloor
    })
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )