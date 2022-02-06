import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class='flex-rows'>
  <div class='flex-columns'>
    <di-combat-adventurer-pane class="adv1"></di-combat-adventurer-pane>
    <div class="mid-thing">VS.</div>
    <di-combat-adventurer-pane class="adv2"></di-combat-adventurer-pane>
    <di-combat-monster-pane></di-combat-monster-pane>
  </div>
  <div class="content-well">
    <di-combat-feed></di-combat-feed>
  </div>
</div>
`

export default class CombatPage extends Page{

  constructor(combatID){
    super()
    this.combatID = combatID
    this.innerHTML = HTML
    this.adventurerPane = this.querySelector('.adv1')
    this.adventurerPane2 = this.querySelector('.adv2')
    this.monsterPane = this.querySelector('di-combat-monster-pane')
  }

  async load(){

    const { combat, currentTime, adventurer, adventurer2, monster } = await fizzetch(`/game/combat/${this.combatID}`)
    this.combat = combat

    this._setupAdventurer(adventurer, this.adventurerPane)

    if(monster){
      this._setupMonster(monster, this.monsterPane)
      this.adventurerPane2.remove()
    }else{
      this._setupAdventurer(adventurer2, this.adventurerPane2)
      this.monsterPane.remove()
    }

    this._setTime(currentTime)
  }

  _setTime(time){

  }

  _setupAdventurer(adventurer, pane){

  }

  _setupMonster(monster, pane){

  }
}