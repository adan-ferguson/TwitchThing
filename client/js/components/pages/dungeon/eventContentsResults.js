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
import { goldEntry, orbPointEntry, skillPointEntry } from '../../common.js'
import { consolidatedChestList, inventoryItemsToRows } from '../../listHelpers.js'

const WAIT_TIME = 500
const MAX_CHESTS = 20

const HTML = `
<di-tabz>
  <div data-tab-name="Results"></div>
  <div data-tab-name="Loot" class="fill-contents">
    <div class="flex-rows">
      <div class="flex-grow chest-list"></div>
    </div>
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

  get tabz(){
    return this.querySelector('di-tabz')
  }

  showFinalizerButton(fn){
    const el = this.querySelector('.finalizer')
    el.classList.remove('displaynone')
    el.onclick = fn
  }

  play(dungeonRun, adventurerPane, watching){

    this._linkedAdventurerPane = adventurerPane

    adventurerPane.setAdventurer(new Adventurer(deepClone(dungeonRun.adventurer)))

    requestAnimationFrame(() => {
      this._skipAnimations = false
      waitUntilDocumentVisible().then(() => {
        this._showMainResults(this.tabz.getContentEl('Results'), dungeonRun, adventurerPane, watching)
      })
    })

    this._setupLootTab(dungeonRun.rewards.chests)
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
    this._addText(el)

    this._addNewline(el)
    await this._adventurerXp(el, dungeonRun.results, adventurerPane)

    if(dungeonRun.rewards.gold){
      this._addNewline(el)
      this._addText(el, `+${dungeonRun.rewards.gold} gold`)
      await this._wait()
    }

    this._addNewline(el)
    await this._addChests(el, dungeonRun.rewards.chests, watching)
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

  _setupLootTab(chests){
    if(!chests || !chests.length){
      this.tabz.hideTab('Loot')
      return
    }
    const list = consolidatedChestList(chests).setOptions({
      pageSize: 12,
      paginate: 'maybe',
    })
    this.tabz.getContentEl('Loot').querySelector('.chest-list').appendChild(list)
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

    if(!chests?.length){
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
        this._addText(el, `And ${chests.length - MAX_CHESTS + 1} more, check the Loot tab for a breakdown.`)
        break
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