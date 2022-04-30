import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'
import { getSocket } from '../../../socketClient.js'
import { pageFromString } from '../../app.js'
import ExploringSubpage from './exploring/exploringSubpage.js'
import { hideAll as hideAllTippys } from 'tippy.js'
import CombatSubpage from './combat/combatSubpage.js'
import ResultsSubpage from './results/resultsSubpage.js'
import { fadeIn, fadeOut } from '../../../animationHelper.js'

export default class DungeonPage extends Page{

  subpage

  _adventurerID
  _dungeonRunID
  _watchView

  adventurer
  dungeonRun

  constructor(ID, watchView = false){
    super()
    if(!watchView){
      this._adventurerID = ID
    }else{
      this._dungeonRunID = ID
      this._watchView = true
    }
  }

  get titleText(){
    return this.subpage.titleText
  }

  get currentEvent(){
    return this.dungeonRun.currentEvent || this.dungeonRun.events.at(-1)
  }

  async load(){

    const redirect = await this._fetch()
    if(redirect){
      return redirect
    }

    getSocket()
      .emit('join dungeon run room', this.dungeonRun._id)
      .on('dungeon run update', this._parseDungeonUpdate)

    if(this.currentEvent.combatID && this.currentEvent.pending){
      this.setSubpage(CombatSubpage)
    }else if(this.dungeonRun.finished && !this._watchView){
      this.setSubpage(ResultsSubpage)
    }else {
      this.setSubpage(ExploringSubpage)
    }
  }

  async setSubpage(SubpageType){
    if(this._watchView && SubpageType === ResultsSubpage){
      return
    }
    const previousPage = this.subpage
    this.subpage = new SubpageType(this, this.adventurer, this.dungeonRun)
    if(previousPage){
      await fadeOut(previousPage)
      previousPage.destroy()
    }
    hideAllTippys()
    this.innerHTML = ''
    this.appendChild(this.subpage)
    fadeIn(this.subpage)
    this.app.updateTitle()
    this.subpage.update(this.dungeonRun, {
      source: previousPage?.name || 'initial'
    })
  }

  async unload(){
    getSocket().off('dungeon run update', this._parseDungeonUpdate)
  }

  _parseDungeonUpdate = (dungeonRun) => {
    if(dungeonRun.adventurerID !== this.adventurer._id){
      return
    }
    this.dungeonRun = dungeonRun
    this.subpage?.update(dungeonRun, {
      source: 'socket'
    })
  }

  async _fetch(){

    const url =
      this._watchView ?
        `/watch/dungeonrun/${this._dungeonRunID}` :
        `/game/adventurer/${this._adventurerID}/dungeonrun`

    const {
      adventurer,
      dungeonRun,
      error,
      targetPage
    } = await fizzetch(url)
    if(targetPage){
      return this.redirectTo(pageFromString(targetPage.name, targetPage.args))
    }
    if(error){
      throw error
    }
    this.adventurer = adventurer
    this.dungeonRun = dungeonRun
  }
}

customElements.define('di-dungeon-page', DungeonPage )