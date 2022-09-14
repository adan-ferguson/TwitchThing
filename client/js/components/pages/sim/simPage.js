import AdventurerRow from '../../adventurer/adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import { hideLoader, showLoader } from '../../../loader.js'
import Page from '../page.js'
import MonsterInstance from '../../../../../game/monsterInstance.js'
import { makeEl } from '../../../../../game/utilFunctions.js'
import CombatPage from '../combat/combatPage.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <di-tabz>
      <di-list data-tab-name="Adventurers"></di-list>
      <di-list data-tab-name="Monsters"></di-list>
    </di-tabz>
  </div>
  <div class="flex-rows right-side">
    <div class="fighter fighter-0"></div>
    <div class="supertitle">VERSUS</div>
    <div class="fighter fighter-1"></div>
    <button class="go" disabled="disabled">Go!</button>
  </div>
</div>
`

export default class SimPage extends Page{

  _fighters = []
  _goButton
  _adventurersListEl

  constructor(){
    super()
    this.innerHTML = HTML
    this._adventurersListEl = this.querySelector('di-list[data-tab-name="Adventurers"]')
      .setOptions({
        pageSize: 6
      })
    this._monstersListEl = this.querySelector('di-list[data-tab-name="Monsters"]')
      .setOptions({
        pageSize: 10
      })
    this._goButton = this.querySelector('.go')
    this._goButton.addEventListener('click', () => {
      this._go()
    })
  }

  static get pathDef(){
    return ['admin', 'sim']
  }

  get ready(){
    return (this._fighters[0] && this._fighters[1]) ? true : false
  }

  async load(){
    const { adventurers, monsters } = await this.fetchData()

    const rows = []
    adventurers.forEach(adventurer => {
      const row = new AdventurerRow(adventurer)
      row.addEventListener('click', e => {
        this._chooseAdventurer(adventurer)
      })
      rows.push(row)
    })
    this._adventurersListEl.setRows(rows)

    const mrows = []
    monsters.forEach(monsterDef => {
      const monsterInstance = new MonsterInstance(monsterDef)
      const row = makeMonsterRow(monsterInstance)
      row.addEventListener('click', e => {
        this._chooseMonster(monsterInstance)
      })
      mrows.push(row)
    })
    this._monstersListEl.setRows(mrows)
  }

  _chooseAdventurer(adventurer){
    const row = new AdventurerRow(adventurer)
    row.classList.add('buttonish')
    this._chooseFighter(row, adventurer)
  }

  _chooseMonster(monsterInstance){
    const row = makeMonsterRow(monsterInstance)
    this._chooseFighter(row, monsterInstance.monsterDef)
  }

  _chooseFighter(row, fighterDef){

    const index = this._fighters[0] ? (this._fighters[1] ? -1 : 1) : 0
    if(index === -1){
      return
    }

    const el = this.querySelector('.fighter-' + index)
    this._fighters[index] = fighterDef

    el.appendChild(row)
    row.addEventListener('click', () => {
      row.remove()
      this._fighters[index] = null
      this._updateButton()
    })

    this._updateButton()
  }

  _updateButton(){
    this._goButton.toggleAttribute('disabled', !this.ready)
  }

  async _go(){
    if(!this.ready){
      return
    }
    showLoader('Generating Combat')
    const { combatID } = await fizzetch('/game/admin/sim/run', {
      fighter1: this._fighters[0],
      fighter2: this._fighters[1]
    })
    hideLoader()
    if(combatID){
      this.redirectTo(CombatPage.path(combatID))
    }
  }
}
customElements.define('di-sim-page', SimPage)

function makeMonsterRow(monsterInstance){
  return makeEl({
    class: ['monster-row', 'buttonish'],
    text: `Lvl. ${monsterInstance.level} ${monsterInstance.displayName}`
  })
}