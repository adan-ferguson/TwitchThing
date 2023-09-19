import Page from '../page.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import DIForm from '../../form.js'
import { localStorageItem } from '../../../localStorageItem.js'

const FORM_HTML = `
<div class="input-group">
  <div class="input-title">Pace</div>
  <label>
    <input type="radio" name="pace" value="Brisk">
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
    <di-checkbox class="super-dungeon flex-no-grow">SUPER Dungeon</di-checkbox>
    <di-floor-picker></di-floor-picker>
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
    this._formEl = new DIForm({
      async: true,
      fullscreenLoading: { message: 'Entering Dungeon...' },
      action: `/game/adventurer/${this.adventurerID}/enterdungeon`,
      submitText: 'Go!',
      html: FORM_HTML,
      success: ({ dungeonRun }) => {
        this.storedOptions.setMulti(this._formEl.data())
        this.redirectTo(DungeonPage.path(dungeonRun._id))
      },
      extraData: () => ({
        startingFloor: this.floorPicker.value,
        superDungeon: this.superDungeonCheckbox.input.checked,
      })
    })
    this.querySelector('.stuff').appendChild(this._formEl)

    const val = this.storedOptions.restThreshold
    const restSlider = this.querySelector('[name=restThreshold]')
    restSlider.value = val

    const restText = this.querySelector('.rest-threshold-text')
    restText.textContent = val
    restSlider.addEventListener('input', () => {
      restText.textContent = restSlider.value
    })

    const radio = this.querySelector(`[name=pace][value=${this.storedOptions.pace}]`)
    if(radio){
      radio.checked = true
    }

    this.superDungeonCheckbox.input.addEventListener('change', () => {
      this.storedOptions.superDungeon = this.superDungeonCheckbox.input.checked
      this._updateFloorPicker()
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

  get storageKey(){
    return `dungeon-picker-options-${this.adventurerID}`
  }

  get storedOptions(){
    return localStorageItem(this.storageKey, {
      pace: 'Brisk',
      restThreshold: 50,
      superDungeon: false,
    })
  }

  get superDungeonCheckbox(){
    return this.querySelector('.super-dungeon')
  }

  get floorPicker(){
    return this.querySelector('di-floor-picker')
  }

  async load(){

    const { adventurer } = await this.fetchData()

    this.adventurer = adventurer

    if(adventurer.accomplishments.deepestSuperFloor > 0){
      this.superDungeonCheckbox.input.checked = this.storedOptions.superDungeon
    }else{
      this.superDungeonCheckbox.classList.add('displaynone')
    }

    this._updateFloorPicker()
  }

  _updateFloorPicker(){
    const maxProp = this.storedOptions.superDungeon ? 'deepestSuperFloor' : 'deepestFloor'
    this.floorPicker.setOptions({
      max: this.adventurer.accomplishments[maxProp],
      showTutorialTooltip: this.user.features.dungeonPicker === 1
    })
  }
}

customElements.define('di-dungeon-picker-page', DungeonPickerPage )