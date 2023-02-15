import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import DIForm from '../../form.js'

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
<div class="input-group">
  <label>
    Rest when health is below <span class="bolded"><span class="rest-threshold-text">50</span>%</span>
    <input type="range" min="0" max="100" step="5" value="50" name="restThreshold">
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

const REST_THRESHOLD_STORAGE_KEY = 'rest-threshold'

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
      success: ({ dungeonRun }) => this.redirectTo(DungeonPage.path(dungeonRun._id)),
      extraData: () => ({ startingFloor: this.floorSlider.value })
    })
    this.querySelector('.stuff').appendChild(this._formEl)

    const val = localStorage.getItem(REST_THRESHOLD_STORAGE_KEY) ?? 50
    const restSlider = this.querySelector('[name=restThreshold]')
    restSlider.value = val

    const restText = this.querySelector('.rest-threshold-text')
    restText.textContent = val
    restSlider.addEventListener('input', () => {
      restText.textContent = restSlider.value
      localStorage.setItem(REST_THRESHOLD_STORAGE_KEY, restSlider.value)
    })
  }

  static get pathDef(){
    return ['adventurer', 0, 'dungeonpicker']
  }

  get pathArgs(){
    return [this.adventurerID]
  }

  get titleText(){
    return 'Entering Dungeon'
  }

  async load(){

    const { adventurer } = await this.fetchData()

    this.adventurer = adventurer
    this.floorSlider.setOptions({
      max: adventurer.accomplishments.deepestFloor,
      showTutorialTooltip: this.user.features.dungeonPicker === 1
    })
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )