import { makeEl, toDisplayName, wait } from '../../../../../game/utilFunctions.js'
import ChestOpenage from './chestOpenage.js'
import MonsterInstance from '../../../../../game/monsterInstance.js'

const WAIT_TIME = 500

const HTML = `
<di-tabz>
  <div data-tab-name="Results"></div>
  <div data-tab-name="Monsters"></div>
</di-tabz>
<button class="finalizer appealing displaynone">Finish</button>
`

export default class EventContentsResults extends HTMLElement{

  _skipAnimations = false
  _linkedAdventurerPane

  constructor(){
    super()
    this.classList.add('flex-rows', 'fill-contents')
    this.innerHTML = HTML
    window.addEventListener('click', this._skipAnims)
  }

  showFinalizerButton(fn){
    const el = this.querySelector('.finalizer')
    el.classList.remove('displaynone')
    el.onclick = fn
  }

  play(dungeonRun, adventurerPane, watching){

    this._linkedAdventurerPane = adventurerPane

    const tabz = this.querySelector('di-tabz')
    adventurerPane.setAdventurer(JSON.parse(JSON.stringify(dungeonRun.adventurer)))

    waitUntilDocumentVisible().then(() => {
      this._showMainResults(tabz.getContentEl('Results'), dungeonRun, adventurerPane, watching)
    })

    this._setupMonstersTab(tabz.getContentEl('Monsters'), dungeonRun.results.monstersKilled)
  }

  async _showMainResults(el, dungeonRun, adventurerPane, watching){

    this._addText(el, `Floor: ${dungeonRun.floor}`)
    await this._wait()
    this._addText(el, `Room: ${dungeonRun.room}`)
    await this._wait()

    const monsterName = dungeonRun.results.killedByMonster ?
      new MonsterInstance(dungeonRun.results.killedByMonster).displayName :
      'Something'
    this._addText(el, `Killed By: ${toDisplayName(monsterName)}`)
    await this._wait()

    this._addNewline(el)
    await this._adventurerXp(el, dungeonRun.results, adventurerPane)

    this._addNewline(el)
    await this._addChests(el, dungeonRun.results.chests, watching)
  }

  _adventurerXp = async (el, dungeonRunResults, adventurerPane) => {
    if(!dungeonRunResults.xp){
      return
    }
    const advName = adventurerPane.adventurerInstance.displayName
    this._addText(el, `${advName} gained +${dungeonRunResults.xp} xp`)
    await adventurerPane.addXp(dungeonRunResults.xp, {
      onLevelup: level => {
        this._addText(el, `${advName} has reached level ${level}`)
      },
      skipAnimation: this._skipAnimations
    })
  }

  _setupMonstersTab(el, monstersKilled){
    for(let i = 0; i < monstersKilled.length; i++){
      const { name, amount } = monstersKilled[i]
      this._addText(el, `${toDisplayName(name)} ${amount}`)
    }
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

  async _wait(time = WAIT_TIME){
    if(this._skipAnimations){
      return
    }
    return await wait(time)
  }

  async _addChests(el, chests, chestsOpened){

    if(!chests.length){
      return
    }

    const checkOpenAllButton = () => {
      if(chestsOpened || !this.querySelector('di-chest-openage:not(.opened)')){
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
      const openage = new ChestOpenage(chests[i], chestsOpened)
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

  _skipAnims = () => {
    this._skipAnimations = true
    if(this._linkedAdventurerPane){
      this._linkedAdventurerPane.skipToEndOfXpAnimation()
    }
    window.removeEventListener('click', this._skipAnims)
  }
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

customElements.define('di-dungeon-event-contents-results', EventContentsResults)