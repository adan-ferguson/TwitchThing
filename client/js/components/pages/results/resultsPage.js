import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import MainPage from '../main/mainPage.js'
import Modal from '../../modal.js'
import LevelupSelector from './levelupSelector.js'
import { show as showLoader } from '../../../loader.js'

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

    wait(500).then(async () => {
      await Promise.all([this._adventurerXp(), this._userXp(), this._loot()])
      this._enableButton(adventurer, this.dungeonRun.results.levelups)
    })
  }

  async _adventurerXp(){
    const xpRow = document.createElement('div')
    xpRow.textContent = `+${this.dungeonRun.results.rewards.xp} xp`
    this.results.appendChild(xpRow)
    await this.adventurerPane.addXp(this.dungeonRun.results.rewards.xp)
  }

  async _userXp(){
    await this.app.header.addUserXp(this.dungeonRun.results.rewards.xp)
  }

  async _loot(){

  }

  _enableButton(adventurer, levelups){
    if(levelups.length){
      this.doneButton.textContent = 'Level up'
      this.doneButton.classList.add('levelup')
    }
    this.doneButton.classList.remove('hidden')
    this.doneButton.addEventListener('click', async () => {
      if(levelups.length){
        const selector = new LevelupSelector()
        selector.setLevelups(adventurer, levelups)
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
}

function wait(time = 0){
  return new Promise(res => {
    setTimeout(res, time)
  })
}
customElements.define('di-results-page', ResultsPage )