import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import LevelupSelector from './levelupSelector.js'
import DungeonRunResults from '../../../../../game/dungeonRunResults.js'
import { mergeStats } from '../../../../../game/stats/stats.js'
import SimpleModal from '../../simpleModal.js'
import ChestOpenage from './chestOpenage.js'
import { showLoader } from '../../../loader.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'
import { pageFromString } from '../../app.js'

const WAIT_TIME = 500

const HTML = `
<div class='content-columns'>
  <di-adventurer-pane></di-adventurer-pane>
  <div class='content-rows results' style='flex-grow:1.5'>
    <div class="title">Results</div>
    <div class='results-list'></div>
    <button class="done hidden">Okay</button>
  </div>
</div>
`

export default class ResultsPage extends Page{

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
    this.adventurerPane = this.querySelector('di-adventurer-pane')
    this.results = this.querySelector('.results-list')
    this.doneButton = this.querySelector('.done')
  }

  async load(){

    const { dungeonRun, adventurer, error, targetPage } = await fizzetch(`/game/adventurer/${this.adventurerID}/results`)
    if(targetPage){
      return this.redirectTo(pageFromString(targetPage, [this.adventurerID]))
    }else if(error){
      return error
    }

    this._selectedBonuses = []
    this.adventurerPane.setAdventurer(adventurer)

    this.adventurer = adventurer
    this.dungeonRun = dungeonRun
    this.dungeonRunResults = new DungeonRunResults(dungeonRun)

    const fns = [
      this._showDungeonResult,
      this._userXp,
      this._adventurerXp
    ]

    waitUntilDocumentVisible().then(async () => {
      for(let fn of fns){
        await fn()
      }
      this._updateButton()
    })
  }

  _showDungeonResult = async () => {
    this._addResultText(`Floor: ${this.dungeonRun.floor}`)
    await wait()
    this._addResultText(`Room: ${this.dungeonRun.room}`)
    await wait()

    const monsterName = this.dungeonRunResults.lastEvent.monster?.name || 'something'
    this._addResultText(`Killed By: ${toDisplayName(monsterName)}`)
    await wait()

    const monsterCount = this.dungeonRunResults.monstersKilled.count
    if(monsterCount){
      this._addResultText(`Monsters Killed: ${monsterCount}`)
      await wait()
    }

    const relicCount = this.dungeonRunResults.relicsFound.count
    if(relicCount){
      this._addResultText(`Relics Found: ${relicCount}`)
      await wait()
    }

    const chestCount = this.dungeonRunResults.chestsFound.count
    if(chestCount){
      this._addResultText(`Chests Found: ${chestCount}`)
      await wait()
    }

    this._addResultNewline()
  }

  _adventurerXp = async () => {
    this._addResultText(`${this.adventurer.name} gained +${this.dungeonRun.results.rewards.xp} xp`)
    await this.adventurerPane.addXp(this.dungeonRun.results.rewards.xp)
    for(let i = 0; i < this.dungeonRun.results.levelups.length; i++){
      this._showLevelUp(i)
      await wait()
    }
  }

  _userXp = async () => {
    this._addResultText(`You gained +${this.dungeonRun.results.rewards.xp} xp`)
    await this.app.header.addUserXp(this.dungeonRun.results.rewards.xp, this._userLevelUp)
  }

  _showLevelUp = index => {
    const levelup = this.dungeonRun.results.levelups[index]
    const selector = new LevelupSelector()
    this.adventurer.level = levelup.level
    selector.setData(
      this.adventurer,
      levelup,
      bonus => {
        if(levelup.level === 1){
          row.textContent = '^ You can change your mind until you click the "Okay" button below.'
        }else{
          row.parentElement?.removeChild(row)
        }
        this._selectedBonuses[index] = bonus
        this._updateStats()
        this._updateButton()
      })
    this._addResult(selector)
    this._updateStats()
    const row = this._addResultText('Choose a Bonus')
  }

  _userLevelUp = level => {
    const obj = this.dungeonRunResults.getUserLevelup(level)
    this._addResultText(`You leveled up to level ${level}`)
    if(level % 10 === 0){
      this._addResultText('You\'ve unlocked a new adventurer slot')
    }
    obj.features.forEach(featureName => {
      this._addResultText(`New feature unlocked: ${featureName}`)
    })
  }

  _updateButton(){
    if(!this.doneButton.classList.contains('hidden')){
      return
    }
    if(this._selectedBonuses.length === this.dungeonRun.results.levelups.length){
      if(this._selectedBonuses.find(bonus => !bonus)){
        return
      }
      this.doneButton.classList.remove('hidden')
      this.doneButton.addEventListener('click', () => this._finish())
    }
  }

  async _finish(){
    await showPopups(this.dungeonRunResults)
    showLoader()
    const results = await fizzetch(`/game/adventurer/${this.adventurerID}/confirmresults`, {
      selectedBonuses: this._selectedBonuses
    })
    if(!results.error){
      this.redirectTo(new AdventurerPage(this.adventurerID))
    }
    // TODO: handle error, usually just shouldn't happen though
  }

  _addResult(row){
    this.results.appendChild(row)
    this.results.scrollTop = this.results.scrollHeight
    return row
  }

  _addResultText(text){
    const row = document.createElement('div')
    row.textContent = text
    return this._addResult(row)
  }

  _addResultNewline(){
    const row = document.createElement('br')
    return this._addResult(row)
  }

  _updateStats(){
    const selectors = [...this.querySelectorAll('di-adventurer-levelup-selector')]
    const extraStats = selectors.map(selector => selector.extraStats)
    this.adventurerPane.setBonusStats(mergeStats(...extraStats))
  }
}

function wait(time = WAIT_TIME){
  return new Promise(res => {
    setTimeout(res, time)
  })
}

function waitUntilDocumentVisible(){
  return new Promise(res => {
    if(!document.hidden){
      return res()
    }
    const interval = setInterval(() => {
      if(!document.hidden){
        clearInterval(interval)
        res()
      }
    })
  })
}

async function showPopups(dungeonRunResults){

  if(!dungeonRunResults.chests.length){
    return
  }

  const modal = new SimpleModal()
  modal.setOptions({ closeOnUnderlayClick: false })

  for(let i = 0; i < dungeonRunResults.chests.length; i++){
    await showPopup(dungeonRunResults.chests[i], i === dungeonRunResults.chests.length - 1)
  }

  modal.hide(true)

  function showPopup(chest, lastOne){
    return new Promise(res => {
      modal.setContent(new ChestOpenage(chest), true)
      modal.setButtons({
        text: lastOne ? 'Finish' : 'Next',
        fn: () => {
          res()
          return false
        }
      })
      modal.show()
    })
  }
}

customElements.define('di-results-page', ResultsPage )