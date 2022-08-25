import AdventurerRow from '../../adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import CombatPage from '../combat/combatPage.js'
import { showLoader } from '../../../loader.js'
import Page from '../page.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <di-list></di-list>
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

  _adventurers = []
  _goButton
  _listEl

  constructor(){
    super()
    this.innerHTML = HTML
    this._listEl = this.querySelector('di-list')
      .setOptions({
        pageSize: 6
      })
    this._goButton = this.querySelector('.go')
    this._goButton.addEventListener('click', () => {
      this._go()
    })
  }

  get ready(){
    return (this._adventurers[0] && this._adventurers[1]) ? true : false
  }

  async load(_){
    const { adventurers } = await this.fetchData('/game/sim')
    const rows = []
    adventurers.forEach(adventurer => {
      const row = new AdventurerRow(adventurer)
      row.addEventListener('click', e => {
        this._chooseAdventurer(adventurer)
      })
      rows.push(row)
    })
    this._listEl.setRows(rows)
  }

  _chooseAdventurer(adventurer){
    const index = this._adventurers[0] ? (this._adventurers[1] ? -1 : 1) : 0
    if(index === -1){
      return
    }

    const row = new AdventurerRow(adventurer)
    row.classList.add('buttonish')
    const el = this.querySelector('.fighter-' + index)
    this._adventurers[index] = adventurer

    el.appendChild(row)
    row.addEventListener('click', () => {
      row.remove()
      this._adventurers[index] = null
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
    const { combatID } = await fizzetch('/game/sim/run', {
      fighter1: this._adventurers[0]._id,
      fighter2: this._adventurers[1]._id
    })
    this.redirectTo(new CombatPage(combatID, {
      isReplay: true
    }))
  }
}
customElements.define('di-sim-page', SimPage)