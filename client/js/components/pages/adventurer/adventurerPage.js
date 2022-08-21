import Page from '../page.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'

import AdventurerLoadoutEditorPage from '../adventurerLoadout/adventurerLoadoutEditorPage.js'

import '../../adventurerPane.js'
import LevelupPage from '../levelup/levelupPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import fizzetch from '../../../fizzetch.js'
import AdventurerPreviousRunsPage from '../adventurerPreviousRuns/adventurerPreviousRunsPage.js'
import tippyCallout from '../../effects/tippyCallout.js'
import { showLoader } from '../../../loader.js'
import SimpleModal from '../../simpleModal.js'
import MainPage from '../main/mainPage.js'

const HTML = `
<div class="content-columns">
  <div class="content-rows">
    <di-adventurer-pane></di-adventurer-pane>
    <button class="edit content-no-grow">Edit Equipment</button>
  </div>
  <div class="content-rows dungeons">
    <div class="top-right content-well center-contents clickable"></div>
    <div class="previous-runs content-well center-contents clickable">View Previous Runs</div>
    <div class="content-no-grow scary-buttons">
      <button class="clickable dismiss">Dismiss Adventurer</button>
    </div>
  </div>
</div>
`

export default class AdventurerPage extends Page{

  _topRightButton
  _prevRuns

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
    this.adventurerPane = this.querySelector('di-adventurer-pane')
    this._topRightButton = this.querySelector('.top-right')
    this._prevRuns = this.querySelector('.previous-runs')
    this._prevRuns.addEventListener('click', () => {
      this.redirectTo(new AdventurerPreviousRunsPage(this.adventurerID))
    })
    this.querySelector('.dismiss').addEventListener('click', () => {
      new SimpleModal(`Are you sure you want to dismiss ${this.adventurer.name}? Just to clarify I mean DELETE!\n\nEquipped items will be returned to your inventory.`, [{
        text: 'DELETE',
        style: 'scary',
        fn: () => {
          showLoader()
          fizzetch(`/game/adventurer/${this.adventurerID}/dismiss`)
            .then(() => {
              this.redirectTo(new MainPage())
            })
        }
      },{
        text: 'Do not delete'
      }]).show()
    })
  }

  get titleText(){
    return this.adventurer?.name
  }

  async load(previousPage){
    const { adventurer } = await this.fetchData(`/game/adventurer/${this.adventurerID}`)

    if(adventurer.dungeonRunID){
      return this.redirectTo(new DungeonPage(adventurer.dungeonRunID))
    }

    this.adventurer = adventurer
    this.adventurerPane.setAdventurer(adventurer)
    this._setupEditEquipmentButton()
    this._setupTopRightButton()

    this._prevRuns.classList.toggle('displaynone', adventurer.accomplishments.deepestFloor <= 1)
  }

  _setupEditEquipmentButton(){

    const btn = this.querySelector('button.edit')
    const featureStatus = this.user.features.editLoadout
    if(!featureStatus){
      btn.disabled = true
      return
    }else if(featureStatus === 1){
      btn.classList.add('glow')
      tippyCallout(btn, 'Click here to edit your items')
    }

    btn.addEventListener('click', () => {
      this.redirectTo(new AdventurerLoadoutEditorPage(this.adventurerID))
    })
  }

  _setupTopRightButton(){
    if(this.adventurer.nextLevelUp){
      this._topRightButton.classList.add('highlight')
      this._topRightButton.innerHTML = '<div>Level Up!<div/>'
      this._topRightButton.addEventListener('click', () => {
        this.redirectTo(new LevelupPage(this.adventurerID))
      })
    }else{
      this._topRightButton.innerHTML = '<div>Enter Dungeon<div/>'
      this._topRightButton.addEventListener('click', () => {
        if(this.user.features.dungeonPicker){
          this.redirectTo(new DungeonPickerPage(this.adventurerID))
        }else{
          this._quickEnterDungeon()
        }
      })
    }
  }

  async _quickEnterDungeon(){
    showLoader()
    const { dungeonRun } = await fizzetch(`/game/adventurer/${this.adventurerID}/enterdungeon`)
    this.redirectTo(new DungeonPage(dungeonRun._id))
  }
}

customElements.define('di-adventurer-page', AdventurerPage)