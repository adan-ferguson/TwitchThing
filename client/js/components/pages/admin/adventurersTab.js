import fizzetch from '../../../fizzetch.js'
import { hideLoader, showLoader } from '../../../loader.js'
import { makeEl, wrapText } from '../../../../../game/utilFunctions.js'
import OrbRow from '../../orbRow.js'
import Adventurer from '../../../../../game/adventurer.js'

const HTML = `
<div class="content-well fill-contents">
  <di-list></di-list>
</div>
<div class="content-well">
  <di-adventurer-pane></di-adventurer-pane>
</div>
`

export default class AdminAdventurerTab extends HTMLElement{

  constructor(){
    super()
    this.classList.add('content-columns')
    this.innerHTML = HTML
    this._list = this.querySelector('di-list')
      .setOptions({
        pageSize: 10
      })
    this._adventurerPane = this.querySelector('di-adventurer-pane')
  }

  async show(){
    showLoader('Loading adventurers...')
    const { adventurers } = await fizzetch('/game/admin/adventurers')
    hideLoader()
    const rows = []
    adventurers.forEach(adventurer => {
      const row = wrapAdventurer(adventurer)
      row.addEventListener('click', e => {
        console.log(adventurer)
        this._adventurerPane.setAdventurer(new Adventurer(adventurer))
      })
      rows.push(row)
    })
    this._list.setRows(rows)
  }
}
customElements.define('di-admin-adventurer-tab', AdminAdventurerTab)

function wrapAdventurer(adventurer){
  const el = makeEl({ class: 'adv-admin-row buttonish' })
  el.append(wrapText(adventurer.name))
  el.append(new OrbRow().setData(adventurer.orbs))
  return el
}