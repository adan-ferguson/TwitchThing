import Subpage from '../subpage.js'
import DungeonPage from '../dungeonPage.js'
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

    this.adventurerPane.setState(dungeonRun.adventurerState, options.animate)
    this.stateEl.updateDungeonRun(dungeonRun, options.animate)
    this.eventEl.update(this.page.currentEvent, dungeonRun.virtualTime)
  }
}

customElements.define('di-exploring-subpage', ExploringSubpage)