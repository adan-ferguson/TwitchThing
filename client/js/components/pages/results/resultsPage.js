import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import MainPage from '../main/mainPage.js'
import Modal from '../../modal.js'
import LevelupSelector from '../../adventurer/levelupSelector.js'

const HTML = `
<div class='flex-columns'>
  <div class='flex-rows' style="flex-basis:300rem;flex-grow:0">
    <div class="content-well">
        <di-adventurer-statsbox></di-adventurer-statsbox>
    </div>
    <div class="loading content-well no-padding">
        <di-loadout></di-loadout>
    </div>
  </div>
  <div class='content-well'>
    <div class='results'></div>
    <button class="done hidden" disabled="disabled">Okay</button>
  </div>
</div>
`

export default class ResultsPage extends Page {

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
    this.statsBox = this.querySelector('di-adventurer-statsbox')
    this.loadout = this.querySelector('di-loadout')
    this.results = this.querySelector('.results')
    this.doneButton = this.querySelector('.done')
  }

  async load(){

    const { venture, adventurer, error } = await fizzetch(`/game/adventurer/${this.adventurerID}/results`)
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
    this.statsBox.setAdventurer(adventurer)
    this.loadout.setAdventurer(adventurer)
    this.venture = venture

    wait(500).then(async () => {
      await this._adventurerXp()
      await this._userXp()
      await this._loot()
      this._enableButton(this.venture.results.levelups)
    })
  }

  async _adventurerXp(){
    const xpRow = document.createElement('div')
    xpRow.textContent = `+${this.venture.results.rewards.xp} xp`
    this.results.appendChild(xpRow)
    await this.statsBox.addXp(this.venture.results.rewards.xp)
  }

  _adventurerLevelups(){
    // return new Promise(res => {
    //   if (!this.venture.results.levelups.length) {
    //     return res()
    //   }
    //   const levelupEl = new LevelupSelector(this.venture.results.levelups)
    //   this.results.appendChild(levelupEl)
    //   levelupEl.addEventListener('finished', e => {
    //     this.selectedBonuses = e.bonuses
    //     res()
    //   })
    // })
    // const levelupEl = document.createElement('div')
    // this.venture.results.levelups[this.selectedBonuses.length].options.forEach(option => {
    //   const btn = document.createElement('button')
    //   btn.textContent = `+${option.value} ${option.type}`
    //   btn.addEventListener('click', () => {
    //
    //   })
    // })
  }

  async _userXp(){
    await this.app.header.addUserXp(this.venture.results.rewards.xp)
  }

  async _loot(){

  }

  _enableButton(levelups){
    if(levelups.length){
      this.doneButton.textContent = 'Level up'
      this.doneButton.classList.add('levelup')
    }
    this.doneButton.classList.remove('hidden')
    this.doneButton.addEventListener('click', async () => {
      if(levelups.length){
        const selector = new LevelupSelector(levelups)
        const modal = new Modal()
        modal.innerPane.appendChild(selector)
        modal.show()
        selector.addEventListener('finished', e => {
          this._finish(e.selectedBonuses)
        })
      }else{
        this._finish()
      }
    })
  }

  async _finish(selectedBonuses = []){
    const results = await fizzetch(`/game/adventurer/${this.adventurerID}/confirmresults`, {
      selectedBonuses
    })
    if(!results.error){
      this.app.setPage(new AdventurerPage(this.adventurerID))
    }
  }
}

function wait(time = 0) {
  return new Promise(res => {
    setTimeout(res, time)
  })
}
customElements.define('di-results-page', ResultsPage )