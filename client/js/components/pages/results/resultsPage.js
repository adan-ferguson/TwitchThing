import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import MainPage from '../main/mainPage.js'
import LevelupSelector from './levelupSelector.js'
import DungeonRunResults from '../../../../../game/dungeonRunResults.js'
import { mergeStats } from '../../../../../game/stats/stats.js'
import SimpleModal from '../../simpleModal.js'
import ChestOpenage from './chestOpenage.js'
import { showLoader } from '../../../loader.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'

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

    const { dungeonRun, adventurer, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/results`)
    if(error){
      if(error.targetPage === 'Adventurer'){
        this.app.setPage(new AdventurerPage(this.adventurerID))
      }else if(error.targetPage === 'Dungeon'){
        this.app.setPage(new DungeonPage(this.adventurerID))
      }else{
        this.app.setPage(new MainPage(error))
      }
    }

    this._selectedBonuses = []
    this.adventurerPane.setAdventurer(adventurer)

    this.adventurer = adventurer
    this.dungeonRun = dungeonRun
    this.dungeonRunResults = new DungeonRunResults(dungeonRun)

    const fns = [
      this._showDungeonResult,
      this._adventurerXp,
      this._userXp
    ]

    waitUntilDocumentVisible().then(async () => {
      for(let fn of fns){
        await fn()
      }
      this._enableButton()
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
    this._addResultText(`Monsters Killed: ${monsterCount}`)
    await wait()

    const relicCount = this.dungeonRunResults.relicsFound.count
    this._addResultText(`Relics Found: ${relicCount}`)
    await wait()

    this._addResultNewline()
  }

  _adventurerXp = async () => {
    this._addResultText(`${this.adventurer.name} gained +${this.dungeonRun.results.rewards.xp} xp`)
    await this.adventurerPane.addXp(this.dungeonRun.results.rewards.xp, this._levelUp)
  }

  _userXp = async () => {
    this._addResultText(`You gained +${this.dungeonRun.results.rewards.xp} xp`)
    await this.app.header.addUserXp(this.dungeonRun.results.rewards.xp, this._userLevelUp)
  }

  _levelUp = level => {
    return new Promise((res) => {
      const levelups = this.dungeonRun.results.levelups
      const selector = new LevelupSelector()
      const index = this._selectedBonuses.length
      this.adventurer.level = level
      selector.setData(
        this.adventurer,
        levelups[index],
        bonus => {
          res()
          row.parentElement?.removeChild(row)
          this._selectedBonuses[index] = bonus
          this._updateStats()
        })
      this._addResult(selector)
      this._updateStats()
      const row = this._addResultText('Choose a Bonus')
    })
  }

  _userLevelUp = level => {
    this._addResultText(`You leveled up to level ${level}`)
    // TODO: use server data for this
    if(level % 10 === 0){
      this._addResultText('You\'ve unlocked a new adventurer slot')
    }
  }

  _enableButton(){
    this.doneButton.classList.remove('hidden')
    this.doneButton.addEventListener('click', () => this._finish())
  }

  async _finish(){
    await showPopups(this.dungeonRunResults)
    showLoader()
    const results = await fizzetch(`/game/adventurer/${this.adventurerID}/confirmresults`, {
      selectedBonuses: this._selectedBonuses
    })
    if(!results.error){
      this.app.setPage(new AdventurerPage(this.adventurerID))
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
      modal.setContent(new ChestOpenage(chest))
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