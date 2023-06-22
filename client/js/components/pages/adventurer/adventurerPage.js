import Page from '../page.js'
import '../../adventurer/adventurerPane.js'
import fizzetch from '../../../fizzetch.js'
import tippyCallout from '../../visualEffects/tippyCallout.js'
import { hideLoader, showLoader } from '../../../loader.js'
import SimpleModal, { alertModal } from '../../simpleModal.js'
import AdventurerPreviousRunsPage from '../adventurerPreviousRuns/adventurerPreviousRunsPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import DungeonPickerPage from '../dungeonPicker/dungeonPickerPage.js'
import Adventurer from '../../../../../game/adventurer.js'
import AdventurerEditPage from '../adventurerEdit/adventurerEditPage.js'
import { orbPointEntry, skillPointEntry, xpIcon } from '../../common.js'
import AddXpModalContent from './addXpModalContent.js'

const HTML = `
<div class="content-columns">
  <div class="content-rows">
    <div class="content-well">
      <di-adventurer-pane></di-adventurer-pane>
    </div>
    <div class="content-no-grow edit-row content-columns">
      <button class="edit">Edit Adventurer</button>
      <button class="spend-points content-no-grow displaynone"></button>
    </div>
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
      new SimpleModal(`
      Are you sure you want to dismiss ${escape(this.adventurer.name)}? Just to clarify I mean DELETE!
      <br/><br/>
      Equipped items will be returned to your inventory.
      <br/><br/>
      You'll gain ${Math.floor(this.adventurer.xp / 2)} ${xpIcon()}`, [{
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

    if(user.features.shop || user.inventory.stashedXp){
      this._setupAdder(user, adventurer)
    }

    this._setupEditEquipmentButton(user)
    this._setupTopRightButton(user)

    const showButtons = user.accomplishments.deepestFloor <= 1
    this._prevRuns.classList.toggle('displaynone', showButtons)
    this.querySelector('.scary-buttons').classList.toggle('displaynone', showButtons)
  }

  _setupEditEquipmentButton(user){

    const btn = this.querySelector('button.edit')
    const pointsBtn = this.querySelector('button.spend-points')
    const featureStatus = user.features.editLoadout

    let points = ''
    const unspentOrbs = this.adventurer.unspentOrbs
    const unspentSkillPoints = this.adventurer.unspentSkillPoints
    if(unspentOrbs > 0){
      points += orbPointEntry(unspentOrbs)
    }
    if(unspentSkillPoints > 0){
      points += skillPointEntry(unspentSkillPoints)
    }
    if(points){
      pointsBtn.classList.remove('displaynone')
      pointsBtn.innerHTML = points
    }

    if(!featureStatus){
      this.querySelector('.edit-row').classList.add('displaynone')
      return
    }else if(featureStatus === 1){
      btn.classList.add('glow','glow-green')
      tippyCallout(btn, 'Edit your items here')
    }else if(user.features.spendPoints === 1){
      pointsBtn.classList.add('glow','glow-green')
      tippyCallout(pointsBtn, 'Spent points here')
    }

    btn.addEventListener('click', () => {
      this.redirectTo(AdventurerEditPage.path(this.adventurerID))
    })
    pointsBtn.addEventListener('click', () => {
      this.redirectTo(AdventurerEditPage.path(this.adventurerID), { tab: 'Spend Points' })
    })
  }

  _setupTopRightButton(user){
    const quickDungeon = user.features.dungeonPicker
    this._topRightButton.textContent = 'Enter Dungeon'
    this._topRightButton.addEventListener('click', () => {
      if(!this.adventurer.isValid){
        alertModal('This adventurer has invalid items for some reason, can not enter dungeon. Is there a scary glowing red rectangle on the left?')
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

  _setupAdder(user, adventurer){
    const adder = this.adventurerPane.showAdder()
    adder.addEventListener('click', () => {
      const content = new AddXpModalContent(user, adventurer)
      new SimpleModal(content, {
        text: 'Confirm',
        style: 'good',
        fn: () => {
          if(content.val){
            showLoader()
            fizzetch(`/game/adventurer/${this.adventurerID}/addxp`, {
              xp: content.val
            }).then(() => {
              hideLoader()
              this.reload()
            })
          }
        }
      }, 'Stashed XP').show()
    })
  }
}

customElements.define('di-adventurer-page', AdventurerPage)