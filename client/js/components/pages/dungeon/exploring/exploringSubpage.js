import Subpage from '../subpage.js'
import CombatSubpage from '../combat/combatSubpage.js'
import ResultsSubpage from '../results/resultsSubpage.js'

const HTML = `
<div class='content-columns'>
  <di-dungeon-adventurer-pane></di-dungeon-adventurer-pane>
  <div class="content-rows">
    <div class="content-well">
        <di-dungeon-event></di-dungeon-event>
    </div>
    <div class="state content-well" style="flex-basis:125rem;flex-grow:0">
        <di-dungeon-state></di-dungeon-state>
    </div>
  </div>
</div>
`

export default class ExploringSubpage extends Subpage{

  adventurerPane
  eventEl
  stateEl

  constructor(page, adventurer, dungeonRun){
    super(page, adventurer, dungeonRun)
    this.innerHTML = HTML
    this.adventurerPane = this.querySelector('di-dungeon-adventurer-pane')
    this.eventEl = this.querySelector('di-dungeon-event')
    this.stateEl = this.querySelector('di-dungeon-state')

    this.adventurerPane.setAdventurer(adventurer)
    this.eventEl.setAdventurer(adventurer)
  }

  get name(){
    return 'exploring'
  }

  get titleText(){
    return 'Exploring'
  }

  update(dungeonRun, options = {}){

    options = {
      source: null,
      ...options
    }

    if(options.source === 'socket'){
      if(dungeonRun.finished){
        return this.page.setSubpage(ResultsSubpage)
      }
      if(this.page.currentEvent.combatID){
        // If from a socket event, transition to socket event
        return this.page.setSubpage(CombatSubpage)
      }
    }

    // TODO: Weird ordering thing can happen
    if(options.source ==='combat' && dungeonRun.finished){
      setTimeout(() => {
        return this.page.setSubpage(ResultsSubpage)
      }, 3000)
    }

    const animate = options.source === 'socket'
    this.adventurerPane.setState(dungeonRun.adventurerState, animate)
    this.eventEl.update(this.page.currentEvent, dungeonRun.virtualTime)
    this.stateEl.updateDungeonRun(dungeonRun, animate || options.source === 'combat')
  }
}

customElements.define('di-exploring-subpage', ExploringSubpage)