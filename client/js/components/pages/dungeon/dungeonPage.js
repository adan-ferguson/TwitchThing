import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import { getSocket } from '../../../socketClient.js'
import { pageFromString } from '../../app.js'
import ExploringSubpage from './exploring/exploringSubpage.js'
import CombatSubpage from './combat/combatSubpage.js'
import ResultsSubpage from './results/resultsSubpage.js'
import { fadeIn, fadeOut } from '../../../animationHelper.js'

export default class DungeonPage extends Page{

  subpage

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
  }

  get currentEvent(){
    return this.dungeonRun.currentEvent || this.dungeonRun.events.at(-1)
  }

  async load(){

    const {
      adventurer,
      dungeonRun,
      error,
      targetPage
    } = await fizzetch(`/game/adventurer/${this.adventurerID}/dungeonrun`)

    if (targetPage){
      return this.redirectTo(pageFromString(targetPage, [this.adventurerID]))
    }

    if (error){
      throw error
    }

    this.dungeonRun = dungeonRun
    this.adventurer = adventurer

    getSocket().on('dungeon run update', this._parseDungeonUpdate)

    if(this.currentEvent.combatID && this.currentEvent.pending){
      this.setSubpage(CombatSubpage)
    } else if (dungeonRun.finished){
      this.setSubpage(ResultsSubpage)
    } else {
      this.setSubpage(ExploringSubpage)
    }
  }

  async setSubpage(SubpageType){
    const previousPage = this.subpage
    this.subpage = new SubpageType(this, this.adventurer, this.dungeonRun)
    this.subpage.update(this.dungeonRun, {
      source: previousPage?.name || 'initial'
    })
    if(previousPage){
      await fadeOut(previousPage)
      previousPage.destroy()
    }
    this.innerHTML = ''
    this.appendChild(this.subpage)
    fadeIn(this.subpage)
  }

  async unload(){
    getSocket().off('dungeon run update', this._parseDungeonUpdate)
  }

  _parseDungeonUpdate = (dungeonRun) => {
    if(dungeonRun.adventurerID !== this.adventurerID){
      return
    }
    this.dungeonRun = dungeonRun
    this.subpage?.update(dungeonRun, {
      source: 'socket'
    })
  }
}

customElements.define('di-dungeon-page', DungeonPage )