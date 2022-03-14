import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import MainPage from '../main/mainPage.js'
import Modal from '../../modal.js'
import LevelupSelector from './levelupSelector.js'
import { show as showLoader } from '../../../loader.js'

const WAIT_TIME = 1250

const HTML = `
<div class='flex-columns'>
  <div class='content-well'>
    <di-adventurer-pane></di-adventurer-pane>
  </div>
  <div class='content-well results'>
    <div class='flex-rows'>
      <div class="title">Results</div>
      <div class='results-list'></div>
      <button class="done hidden">Okay</button>
    </div>
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

    this.selectedBonuses = []
    this.adventurerPane.setAdventurer(adventurer)

    this.dungeonRun = dungeonRun
    this.adventurer = adventurer

    const fns = [
      this._showDungeonResult,
      this._showMonstersKilled,
      this._showRelicsFound,
      this._adventurerXp,
      this._userXp
    ]

    wait(WAIT_TIME).then(async () => {
      for(let fn of fns){
        await fn()
      }
      this._enableButton()
    })
  }

  _showDungeonResult = async () => {
    this._addResultRow(`You were killed by a something on floor ${this.dungeonRun.floor}, room ${this.dungeonRun.room}`)
    await wait(WAIT_TIME)
  }

  _showMonstersKilled = async () => {
    this._addResultRow('Insert monsters killed here')
    await wait(WAIT_TIME)
  }

  _showRelicsFound = async () => {
    this._addResultRow('Insert relics found here')
    await wait(WAIT_TIME)
  }

  _adventurerXp = async () => {
    this._addResultRow(`+${this.dungeonRun.results.rewards.xp} xp`)
    this.adventurerPane.xpBar.addEventListener('levelup', e => {
      this._addResultRow(`${this.adventurer.name} leveled up to level ${e.detail.level}!`)
    })
    await this.adventurerPane.addXp(this.dungeonRun.results.rewards.xp)
  }

  _userXp = async () => {
    await this.app.header.addUserXp(this.dungeonRun.results.rewards.xp)
    this.app.header.xpBar.addEventListener('levelup', e => {
      this._addResultRow(`You leveled up to level ${e.detail.level}!`)
      if(e.detail.level % 10 === 0){
        this._addResultRow('You gained a new adventurer slot.')
      }
    })
  }

  _enableButton(){
    const levelups = this.dungeonRun.results.levelups
    if(levelups.length){
      this.doneButton.textContent = 'Level up'
      this.doneButton.classList.add('levelup')
    }
    this.doneButton.classList.remove('hidden')
    this.doneButton.addEventListener('click', async () => {
      if(levelups.length){
        const selector = new LevelupSelector()
        selector.setLevelups(this.adventurer, levelups)
        const modal = new Modal()
        modal.innerPane.appendChild(selector)
        modal.show()
        selector.addEventListener('finished', e => {
          modal.hide()
          this._finish(e.detail.selectedBonuses)
        })
      }else{
        this._finish()
      }
    })
  }

  async _finish(selectedBonuses = []){
    showLoader()
    const results = await fizzetch(`/game/adventurer/${this.adventurerID}/confirmresults`, {
      selectedBonuses
    })
    if(!results.error){
      this.app.setPage(new AdventurerPage(this.adventurerID))
    }
    // TODO: handle error, usually just shouldn't happen though
  }

  _addResultRow(text){
    const xpRow = document.createElement('div')
    xpRow.textContent = text
    this.results.appendChild(xpRow)
  }
}

function wait(time = 0){
  return new Promise(res => {
    setTimeout(res, time)
  })
}
customElements.define('di-results-page', ResultsPage )