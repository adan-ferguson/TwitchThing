import Page from '../page.js'
import '../../adventurer/adventurerPane.js'
import fizzetch from '../../../fizzetch.js'
import tippyCallout from '../../visualEffects/tippyCallout.js'
import { showLoader } from '../../../loader.js'
import SimpleModal, { alertModal } from '../../simpleModal.js'
import AdventurerPreviousRunsPage from '../adventurerPreviousRuns/adventurerPreviousRunsPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'
import Adventurer from '../../../../../game/adventurer.js'
import AdventurerEditPage from '../adventurerEdit/adventurerEditPage.js'
import { orbPointEntry, skillPointEntry } from '../../common.js'

const HTML = `
<div class="content-columns">
  <div class="content-rows">
    <div class="content-well">
      <di-adventurer-pane></di-adventurer-pane>
    </div>
    <button class="edit content-no-grow">Edit Adventurer</button>
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

  async load(){

    const { adventurer, user } = await this.fetchData()

    if(adventurer.dungeonRunID){
      return this.redirectTo(DungeonPage.path(adventurer.dungeonRunID))
    }

    this.adventurer = new Adventurer(adventurer)
    this.adventurerPane.setAdventurer(this.adventurer)
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
      tippyCallout(btn, 'Edit your items here')
    }else if(user.features.spendPoints === 1){
      btn.classList.add('glow')
      tippyCallout(btn, 'Assign orbs here')
    }

    const unspentOrbs = this.adventurer.unspentOrbs
    const unspentSkillPoints = this.adventurer.unspentSkillPoints
    let points = ' '
    if(unspentOrbs > 0){
      points += orbPointEntry(unspentOrbs)
    }
    if(unspentSkillPoints > 0){
      points += skillPointEntry(unspentSkillPoints)
    }
    btn.innerHTML += points

    btn.addEventListener('click', () => {
      this.redirectTo(AdventurerEditPage.path(this.adventurerID))
    })
  }

  _setupTopRightButton(user){
    const quickDungeon = user.features.dungeonPicker
    this._topRightButton.textContent = 'Enter Dungeon'
    this._topRightButton.addEventListener('click', () => {
      if(!this.adventurer.loadout.isValid){
        alertModal('This adventurer has invalid items for some reason, can not enter dungeon.')
      }else if(quickDungeon){
        this.redirectTo(DungeonPickerPage.path(this.adventurerID))
      }else{
        this._quickEnterDungeon()
      }
    })
  }

  async _quickEnterDungeon(){
    showLoader('Entering Dungeon...')
    const { dungeonRun } = await fizzetch(`/game/adventurer/${this.adventurerID}/enterdungeon`)
    this.redirectTo(DungeonPage.path(dungeonRun._id))
  }
}

customElements.define('di-adventurer-page', AdventurerPage)