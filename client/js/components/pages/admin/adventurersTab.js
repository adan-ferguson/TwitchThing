import AdventurerRow from '../../adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import { hideLoader, showLoader } from '../../../loader.js'

const HTML = `
<div class="content-well fill-contents">
  <di-list></di-list>
</div>
<di-adventurer-pane></di-adventurer-pane>
`

export default class AdminAdventurerTab extends HTMLElement{

  constructor(){
    super()
    this.classList.add('content-columns')
    this.innerHTML = HTML
    this._list = this.querySelector('di-list')
      .setOptions({
        pageSize: 6
      })
    this._adventurerPane = this.querySelector('di-adventurer-pane')
  }

  async show(){
    showLoader('Loading adventurers...')
    const { adventurers } = await fizzetch('/admin/adventurers')
    hideLoader()
    const rows = []
    adventurers.forEach(adventurer => {
      const row = new AdventurerRow(adventurer)
      row.addEventListener('click', e => {
        this._adventurerPane.setAdventurer(adventurer)
      })
      rows.push(row)
    })
    this._list.setRows(rows)
  }
}
customElements.define('di-admin-adventurer-tab', AdminAdventurerTab)