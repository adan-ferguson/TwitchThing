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

const HTML = `
<div class="content-columns">
  <div class="content-rows">
    <di-adventurer-pane></di-adventurer-pane>
    <button class="edit content-no-grow">Edit Equipment</button>
  </div>
  <div class="content-rows dungeons">
      <div class="top-right content-well center-contents clickable"></div>
      <div class="previous-runs content-well center-contents clickable">View Previous Runs</div>
  </div>
</div>
`

export default class AdventurerPage extends Page{

  _topRightButton

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
    this.adventurerPane = this.querySelector('di-adventurer-pane')
    this._topRightButton = this.querySelector('.top-right')
  }

  get titleText(){
    return this.adventurer.name
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

    const prev = this.querySelector('.previous-runs')
    if(adventurer.accomplishments.deepestFloor <= 1){
      prev.remove()
    }else{
      prev.addEventListener('click', () => {
        this.redirectTo(new AdventurerPreviousRunsPage(this.adventurerID))
      })
    }
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