import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import DIForm from '../../form.js'
import fizzetch from '../../../fizzetch.js'

const FORM_HTML = `
<div class="input-group">
  <div class="input-title">Pace</div>
  <label>
    <input type="radio" name="pace" value="Brisk" checked="checked">
    <span>Brisk</span>
    <div class="subtitle">Go deeper as soon as the stairs are found</div>
  </label>
  <label>
    <input type="radio" name="pace" value="Leisurely">
    <span>Leisurely</span>
    <div class="subtitle">Explore the entire floor before taking the stairs</div>
  </label>
</div>
`

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
      fullscreenLoading: { message: 'Entering Dungeon...' },
      action: `/game/adventurer/${this.adventurerID}/enterdungeon`,
      submitText: 'Go!',
      html: FORM_HTML,
      success: ({ dungeonRun }) => this.redirectTo(`/dungeon/${dungeonRun._id}`),
      extraData: () => ({ startingFloor: this.floorSlider.value })
    })
    this.querySelector('.stuff').appendChild(this._formEl)
  }

  get titleText(){
    return this.adventurer.name + ' - Entering Dungeon'
  }

  async load(_){

    const { adventurer, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonpicker`)
    if(error){
      return error
    }

    this.adventurer = adventurer
    this.floorSlider.setOptions({
      max: adventurer.accomplishments.deepestFloor,
      showTutorialTooltip: this.user.features.dungeonPicker === 1
    })
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )