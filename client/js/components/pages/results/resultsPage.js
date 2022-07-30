import fizzetch from '../../../fizzetch.js'
import DungeonRunResults from '../../../../../game/dungeonRunResults.js'
import SimpleModal from '../../simpleModal.js'
import ChestOpenage from './chestOpenage.js'
import { showLoader } from '../../../loader.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import Page from '../page.js'
import RELICS from '../../../relicDisplayInfo.js'
import CHESTS from '../../../chestDisplayInfo.js'

const WAIT_TIME = 500

const HTML = `
<div class='content-columns'>
  <di-adventurer-pane></di-adventurer-pane>
  <div class='content-rows results' style='flex-grow:1.5'>
    <div class='results-list'></div>
    <button class="done hidden">Okay</button>
  </div>
</div>
`

export default class ResultsPage extends Page{

  _dungeonRunID

  constructor(dungeonRunID){
    super()
    this.innerHTML = HTML
    this.adventurerPane = this.querySelector('di-adventurer-pane')
    this.results = this.querySelector('.results-list')
    this.doneButton = this.querySelector('.done')
    this._dungeonRunID = dungeonRunID
  }

  get titleText(){
    return 'Results'
  }

  get adventurer(){
    return this.dungeonRun.adventurer
  }

  async load(source){

    const { dungeonRun } = await this.fetchData(`/game/dungeonrun/${this._dungeonRunID}/results`)

    this.dungeonRun = dungeonRun
    this.adventurerPane.setAdventurer(dungeonRun.adventurer)
    this.dungeonRunResults = new DungeonRunResults(dungeonRun)

    const fns = [
      this._showDungeonResult,
      this._adventurerXp
    ]

    waitUntilDocumentVisible().then(async () => {
      for(let fn of fns){
        await fn()
      }
      this._showButton()
    })
  }

  _showDungeonResult = async () => {
    this._addResultText(`Floor: ${this.dungeonRun.floor}`)
    await wait()
    this._addResultText(`Room: ${this.dungeonRun.room}`)
    await wait()

    const monsterName = this.dungeonRunResults.killedByMonster?.name || 'Something'
    this._addResultText(`Killed By: ${toDisplayName(monsterName)}`)
    await wait()

    const monsterCount = this.dungeonRunResults.monstersKilled.count
    if(monsterCount){
      this._addResultText(`Monsters Killed: ${monsterCount}`)
      await wait()
    }

    const relics = this.dungeonRunResults.relics
    if(relics.length){
      this._addResultNewline()
      await this._addRelics(relics)
      await wait()
    }

    const chests = this.dungeonRunResults.chests
    if(chests.length){
      this._addResultNewline()
      await this._addChests(chests)
      await wait()
    }

    this._addResultNewline()
  }

  _adventurerXp = async () => {
    if(!this.dungeonRunResults.xp){
      return
    }
    this._addResultText(`${this.adventurer.name} gained +${this.dungeonRunResults.xp} xp`)
    await this.adventurerPane.addXp(this.dungeonRunResults.xp, level => {
      this._addResultText(`${this.adventurer.name} has reached level ${level}`)
    })
  }

  _showButton(){
    if(!this.doneButton.classList.contains('hidden')){
      return
    }
    this.doneButton.classList.remove('hidden')
    this.doneButton.addEventListener('click', () => this._finish())
  }

  async _finish(){
    showLoader()
    const results = await fizzetch(`/game/dungeonrun/${this._dungeonRunID}/finalize`)
    if(!results.error){
      this.redirectTo(new AdventurerPage(this.adventurer._id))
    }
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

  _addRelics(relics){
    this._addResultText('Relics:')
    relics.forEach(({ attempted, solved }, tier) => {
      this._addResultText(`${RELICS[tier].displayName} ${solved}/${attempted}`)
    })
  }

  _addChests(chests){
    this._addResultText('Chests:')
    chests.forEach((count, tier) => {
      this._addResultText(`${CHESTS[tier].displayName} ${count}`)
    })
  }
}

function wait(time = WAIT_TIME){
  return new Promise(res => {
    setTimeout(() => {
      res()
    }, time)
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

customElements.define('di-results-page', ResultsPage)