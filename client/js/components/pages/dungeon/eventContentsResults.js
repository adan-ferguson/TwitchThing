import {
  deepClone,
  makeEl,
  suffixedNumber,
  toDisplayName,
  wait,
  wrapContent
} from '../../../../../game/utilFunctions.js'
import ChestOpenage from './chestOpenage.js'
import MonsterInstance from '../../../../../game/monsterInstance.js'
import Adventurer from '../../../../../game/adventurer.js'
import { orbPointEntry, skillPointEntry } from '../../common.js'
import { inventoryItemsToRows } from '../../listHelpers.js'

const WAIT_TIME = 500
const MAX_CHESTS = 20

const HTML = `
<di-tabz>
  <div data-tab-name="Results"></div>
  <div data-tab-name="Monsters"></div>
  <div data-tab-name="Loot">
    <p></p>
    <di-list></di-list>
  </div>
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
    adventurerPane.setAdventurer(new Adventurer(deepClone(dungeonRun.adventurer)))

    requestAnimationFrame(() => {
      this._skipAnimations = false
      waitUntilDocumentVisible().then(() => {
        this._showMainResults(tabz.getContentEl('Results'), dungeonRun, adventurerPane, watching)
      })
    })

    this._setupMonstersTab(tabz.getContentEl('Monsters'), dungeonRun.results.monstersKilled)
    this._setupLootTab(tabz.getContentEl('Loot').querySelector('di-list'), dungeonRun.results.chests)
  }

  stop(){
    this._linkedAdventurerPane.xpBar.skipToEndOfAnimation()
  }

  async _showMainResults(el, dungeonRun, adventurerPane, watching){

    this._addText(el, `Floor: ${dungeonRun.floor}`)
    await this._wait()
    this._addText(el, `Room: ${dungeonRun.room}`)
    await this._wait()
    this._addText(el, getFinishReason(dungeonRun.results.finalEvent))
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
    const advName = adventurerPane.adventurer.name
    this._addText(el, `${advName} gained ${suffixedNumber(dungeonRunResults.xp)} xp`)
    await adventurerPane.addXp(dungeonRunResults.xp, {
      onLevelup: level => {
        const sp = level % 5 === 0 ? `  ${skillPointEntry('+1')}` : ''
        this._addRow(el, wrapContent(`${advName} has reached level ${level} ${orbPointEntry('+1')}${sp}`))
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

  _setupLootTab(list, chests){
    debugger
    const totalItems = {}
    let totalGold = 0
    chests.forEach(c => {
      const { gold, items } = c.contents
      totalGold += gold
      for(let key in items.basic){
        totalItems[key] = (totalItems[key] ?? 0) + items.basic[key]
      }
    })
    list.setRows(inventoryItemsToRows({ basic: totalItems }))
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
      if(i >= MAX_CHESTS){
        this._addText(`And ${chests.length - MAX_CHESTS + 1} more, check the Loot tab for a breakdown.`)
      }
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

function getFinishReason(lastEvent){
  if(lastEvent.roomType === 'cleared'){
    return 'Zone cleared'
  }else if(lastEvent.monster){
    const mi = new MonsterInstance(lastEvent.monster)
    return `Killed by: ${mi.displayName}`
  }else if(lastEvent.roomType === 'outOfOrder'){
    return 'Dungeon finished'
  }else if(lastEvent.roomType === 'leave'){
    return 'Left dungeon'
  }
  return 'Insert finish reason here'
}

customElements.define('di-dungeon-event-contents-results', EventContentsResults)