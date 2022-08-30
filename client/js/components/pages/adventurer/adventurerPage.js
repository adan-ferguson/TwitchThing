import Page from '../page.js'
import '../../adventurerPane.js'
import fizzetch from '../../../fizzetch.js'
import tippyCallout from '../../effects/tippyCallout.js'
import { showLoader } from '../../../loader.js'
import SimpleModal from '../../simpleModal.js'
import AdventurerPreviousRunsPage from '../adventurerPreviousRuns/adventurerPreviousRunsPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerLoadoutEditorPage from '../adventurerLoadout/adventurerLoadoutEditorPage.js'
import LevelupPage from '../levelup/levelupPage.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'

const HTML = `
<div class="content-columns">
  <div class="content-rows">
    <di-adventurer-pane></di-adventurer-pane>
    <button class="edit content-no-grow">Edit Equipment</button>
  </div>
  <div class="content-rows dungeons">
    <div class="top-right content-well center-contents clickable"></div>
    <div class="previous-runs content-well center-contents clickable">View Previous Runs</div>
    <div class="content-no-grow scary-buttons displaynone">
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
      this.redirectTo(AdventurerPreviousRunsPage.path(this.adventurerID))
    })
    this.querySelector('.dismiss').addEventListener('click', () => {
      new SimpleModal(`Are you sure you want to dismiss ${this.adventurer.name}? Just to clarify I mean DELETE!\n\nEquipped items will be returned to your inventory.`, [{
        text: 'DELETE',
        style: 'scary',
        fn: () => {
          showLoader()
          fizzetch(`/game/adventurer/${this.adventurerID}/dismiss`)
            .then(() => {
              this.redirectToMain()
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

  static get pathDef(){
    return ['adventurer', 0]
  }

  get pathArgs(){
    return [this.adventurerID]
  }

  async load(previousPage){
    const { adventurer, user } = await this.fetchData()

    if(adventurer.dungeonRunID){
      return this.redirectTo(DungeonPage.path(adventurer.dungeonRunID))
    }

    this.adventurer = adventurer
    this.adventurerPane.setAdventurer(adventurer)
    this._setupEditEquipmentButton(user)
    this._setupTopRightButton(user)

    const showButtons = user.accomplishments.deepestFloor <= 1
    this._prevRuns.classList.toggle('displaynone', showButtons)
    this.querySelector('.scary-buttons').classList.toggle('displaynone', showButtons)
  }

  _setupEditEquipmentButton(user){

    const btn = this.querySelector('button.edit')
    const featureStatus = user.features.editLoadout
    if(!featureStatus){
      btn.classList.add('displaynone')
      return
    }else if(featureStatus === 1){
      btn.classList.add('glow')
      btn.classList.remove('displaynone')
      tippyCallout(btn, 'Click here to edit your items')
    }

    btn.addEventListener('click', () => {
      this.redirectTo(AdventurerLoadoutEditorPage.path(this.adventurerID))
    })
  }

  _setupTopRightButton(user){
    if(this.adventurer.nextLevelUp){
      this._topRightButton.classList.add('highlight')
      this._topRightButton.innerHTML = '<div>Level Up!<div/>'
      this._topRightButton.addEventListener('click', () => {
        this.redirectTo(LevelupPage.path(this.adventurerID))
      })
    }else{
      this._topRightButton.innerHTML = '<div>Enter Dungeon<div/>'
      this._topRightButton.addEventListener('click', () => {
        if(user.features.dungeonPicker){
          this.redirectTo(DungeonPickerPage.path(this.adventurerID))
        }else{
          this._quickEnterDungeon()
        }
      })
    }
  }

  async _quickEnterDungeon(){
    showLoader('Entering Dungeon...')
    const { dungeonRun } = await fizzetch(`/game/adventurer/${this.adventurerID}/enterdungeon`)
    this.redirectTo(DungeonPage.path(dungeonRun._id))
  }
}

customElements.define('di-adventurer-page', AdventurerPage)