import DungeonRunResults from '../../../../../game/dungeonRunResults.js'
import ChestOpenage from './chestOpenage.js'
import { makeEl, toDisplayName } from '../../../../../game/utilFunctions.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import Page from '../page.js'
import RELICS from '../../../relicDisplayInfo.js'
import DungeonPage from '../dungeon/dungeonPage.js'

const WAIT_TIME = 500

const HTML = `
<div class='content-columns'>
  <di-adventurer-pane></di-adventurer-pane>
  <div class='content-rows results' style='flex-grow:1.5'>
    <div class="content-well scrollable">
      <di-tabz>
        <di-tab data-tab-name="Results"></di-tab>
        <di-tab data-tab-name="Monsters Killed"></di-tab>
        <di-tab data-tab-name="Relics"></di-tab>
      </di-tabz>
    </div>
    <div class="buttons-row">
      <button class="done hidden">Okay</button>
      <button class="clickable replay">Replay <i class="fa-solid fa-rotate"></i></button>
    </div>
  </div>
</div>
`

export default class ResultsPage extends Page{

  _dungeonRunID
  _skipAnimations = false

  constructor(dungeonRunID){
    super()
    this.innerHTML = HTML
    this.adventurerPane = this.querySelector('di-adventurer-pane')
    this._dungeonRunID = dungeonRunID
    this.addEventListener('click', () => {
      this._skipAnimations = true
    })
  }

  get titleText(){
    return 'Results'
  }

  get adventurer(){
    return this.dungeonRun.adventurer
  }

  async load(source){

    this.querySelectorAll('di-tab').forEach(t => t.innerHTML = '')

    const { dungeonRun } = await this.fetchData(
      this.app.publicView ?
        `/dungeonRun/${this._dungeonRunID}` :
        `/game/dungeonrun/${this._dungeonRunID}/results`
    )

    this._setupReplayButton()
    this.dungeonRun = dungeonRun
    this.adventurerPane.setAdventurer(dungeonRun.adventurer)
    this.dungeonRunResults = new DungeonRunResults(dungeonRun)

    this._addMonsters(this.dungeonRunResults.monstersKilled)
    this._addRelics(this.dungeonRunResults.relics)

    waitUntilDocumentVisible().then(async () => {
      await this._showDungeonResult()
      this._showButtons()
    })
  }

  _showDungeonResult = async () => {

    const resultsTab = this.querySelector('di-tab[data-tab-name="Results"]')

    this._addText(resultsTab, `Floor: ${this.dungeonRun.floor}`)
    await this._wait()
    this._addText(resultsTab, `Room: ${this.dungeonRun.room}`)
    await this._wait()

    const monsterName = this.dungeonRunResults.killedByMonster?.name || 'Something'
    this._addText(resultsTab, `Killed By: ${toDisplayName(monsterName)}`)
    await this._wait()

    this._addNewline(resultsTab)
    await this._adventurerXp(resultsTab)

    this._addNewline(resultsTab)
    await this._addChests(resultsTab, this.dungeonRunResults.chests)
  }

  _adventurerXp = async (el) => {
    if(!this.dungeonRunResults.xp){
      return
    }
    this._addText(el, `${this.adventurer.name} gained +${this.dungeonRunResults.xp} xp`)
    await this.adventurerPane.addXp(this.dungeonRunResults.xp, {
      onLevelup: level => {
        this._addText(el, `${this.adventurer.name} has reached level ${level}`)
      },
      animate: !this._skipAnimations,
      triggerEventsEvenIfNoAnimate: true
    })
  }

  async _addChests(el, chests){

    if(!chests.length){
      return
    }

    const checkOpenAllButton = () => {
      if(!this.querySelector('di-chest-openage:not(.opened)')){
        openAllBtn.remove()
      }
    }

    const titleEl = makeEl({
      content: '<span>Chests: </span><button class="open-all">Open All</button>'
    })
    this._addRow(el, titleEl)

    const chestDiv = document.createElement('div')
    chestDiv.classList.add('chests')
    el.appendChild(chestDiv)

    for(let i = 0; i < chests.length; i++){
      const openage = new ChestOpenage(chests[i], this.app.publicView)
      openage.addEventListener('opened', () => {
        checkOpenAllButton()
      })
      this._addRow(chestDiv, openage)
      await this._wait(WAIT_TIME / 3)
    }

    const openAllBtn = titleEl.querySelector('button')
    openAllBtn.addEventListener('click', () => {
      this.querySelectorAll('di-chest-openage').forEach(el => el.open())
    })
    checkOpenAllButton()
  }

  _showButtons(){
    if(!this.app.publicView){
      this.querySelector('.done').classList.remove('hidden')
      this.querySelector('.done').addEventListener('click', () => this._finish())
    }
  }

  async _finish(){
    this.redirectTo(new AdventurerPage(this.adventurer._id))
  }

  _addRow(target, row){
    target.appendChild(row)
    target.scrollTop = target.scrollHeight
    return row
  }

  _addText(target, text){
    const row = document.createElement('div')
    row.textContent = text
    return this._addRow(target, row)
  }

  _addNewline(target){
    const row = document.createElement('br')
    return this._addRow(target, row)
  }

  _addMonsters(monsters){
    if(!monsters.length){
      return this.querySelectorAll('[data-tab-name="Monsters Killed"]')
        .forEach(el => el.classList.add('displaynone'))
    }
    const target = this.querySelector('di-tab[data-tab-name="Monsters Killed"]')
    for(let i = 0; i < monsters.length; i++){
      const { name, amount } = monsters[i]
      this._addText(target, `${toDisplayName(name)} ${amount}`)
    }
  }

  _addRelics(relics){
    if(!relics.length){
      return this.querySelectorAll('[data-tab-name="Relics"]')
        .forEach(el => el.classList.add('displaynone'))
    }
    const target = this.querySelector('di-tab[data-tab-name="Relics"]')
    for(let i = 0; i < relics.length; i++){
      if(!relics[i]){
        continue
      }
      const { attempted, solved } = relics[i]
      this._addText(target, `${RELICS[i].displayName} ${solved}/${attempted}`)
    }
  }

  async _wait(time){
    if(this._skipAnimations){
      return
    }
    return await wait(time)
  }

  _setupReplayButton(runID = this._dungeonRunID){
    const btn = this.querySelector('.replay')
    btn.addEventListener('click', () => {
      this.redirectTo(new DungeonPage(runID))
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

customElements.define('di-results-page', ResultsPage)